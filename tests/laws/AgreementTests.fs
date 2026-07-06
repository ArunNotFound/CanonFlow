module Canon.Core.Tests.AgreementTests

open Xunit
open FsCheck
open FsCheck.Xunit
open Canon.Core
open Canon.Fable
open System
open System.IO
open System.Diagnostics

/// Runs a block of JS code in Node and returns the stdout string.
let runInNode (jsCode: string) =
    let tempFile = Path.GetTempFileName() + ".js"
    File.WriteAllText(tempFile, jsCode)
    
    let psi = ProcessStartInfo("node", tempFile)
    psi.RedirectStandardOutput <- true
    psi.RedirectStandardError <- true
    psi.UseShellExecute <- false
    
    use p = Process.Start(psi)
    p.WaitForExit()
    let out = p.StandardOutput.ReadToEnd().Trim()
    File.Delete(tempFile)
    out

/// F# native evaluator for a subset of constraints.
let evalConstraint (c: Constraint) (value: int) : bool =
    match c with
    | Constraint.Range (Some(Exclusive lo), None) -> decimal value > lo
    | Constraint.Range (None, Some(Exclusive hi)) -> decimal value < hi
    | Constraint.Range (Some(Inclusive lo), None) -> decimal value >= lo
    | Constraint.Range (None, Some(Inclusive hi)) -> decimal value <= hi
    | _ -> true

let evalLattice (l: Lattice<Constraint>) (value: int) : bool =
    Lattice.eval (fun c -> evalConstraint c value) l

type ConstraintGen =
    static member Constraint() =
        Gen.oneof [
            Arb.generate<int> |> Gen.map (fun v -> Constraint.Range(Some(Exclusive(decimal v)), None))
            Arb.generate<int> |> Gen.map (fun v -> Constraint.Range(None, Some(Exclusive(decimal v))))
            Arb.generate<int> |> Gen.map (fun v -> Constraint.Range(Some(Inclusive(decimal v)), None))
            Arb.generate<int> |> Gen.map (fun v -> Constraint.Range(None, Some(Inclusive(decimal v))))
        ]

    static member Lattice() =
        let rec gen size =
            if size <= 0 then
                ConstraintGen.Constraint() |> Gen.map Leaf
            else
                Gen.oneof [
                    ConstraintGen.Constraint() |> Gen.map Leaf
                    gen (size / 2) |> Gen.map Not
                    Gen.map2 (fun a b -> And(a, b)) (gen (size / 2)) (gen (size / 2))
                    Gen.map2 (fun a b -> Or(a, b)) (gen (size / 2)) (gen (size / 2))
                ]
        let rec shrink l =
            match l with
            | True | False | Leaf _ -> Seq.empty
            | Not x -> seq { yield x; yield! shrink x |> Seq.map Not }
            | And(a, b) -> 
                seq {
                    yield a
                    yield b
                    yield! shrink a |> Seq.map (fun a' -> And(a', b))
                    yield! shrink b |> Seq.map (fun b' -> And(a, b'))
                }
            | Or(a, b) -> 
                seq {
                    yield a
                    yield b
                    yield! shrink a |> Seq.map (fun a' -> Or(a', b))
                    yield! shrink b |> Seq.map (fun b' -> Or(a, b'))
                }

        Arb.fromGenShrink (Gen.sized gen, shrink)

[<Properties(Arbitrary = [| typeof<ConstraintGen> |])>]
module AgreementProperties =
    
    [<Property>]
    let ``Node.js validation exactly matches F# evaluation`` (l: Lattice<Constraint>) (value: int) =
        // 1. Native F# evaluation
        let fsResult = evalLattice l value

        // 2. Transpile to TS/JS
        let tsCode, fidelity = Transpiler.emitValidator "test" l
        
        // Skip if not exact (e.g., unsupported constraints)
        if fidelity <> Fidelity.Exact then
            true
        else
            // Strip TypeScript syntax so Node can run it directly as a script
            let jsScript = 
                tsCode
                    .Replace("export function", "function")
                    .Replace(": any", "")
                    .Replace(": boolean", "")
            
            // Append execution and print result
            let executionCode = sprintf "%s\nconsole.log(validate_test(%d));" jsScript value
            
            // 3. Execute in Node.js
            let nodeOutput = runInNode executionCode
            let nodeResult = Boolean.Parse(nodeOutput.ToLower())

            // 4. Assert Agreement
            fsResult = nodeResult
