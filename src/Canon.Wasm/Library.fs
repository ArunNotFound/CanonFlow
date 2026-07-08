namespace Canon.Wasm

open Fable.Core
open Canon.Core
open Canon.Fable
open Canon.Emit

module CanonCompiler =
    
    let transpile(sqlText: string) =
        try
            let tables = DdlParser.parseSql sqlText
            
            // Run Paradox Engine diagnostics
            let diagnostics = ResizeArray<string>()
            for t in tables do
                for c in t.Columns do
                    if c.CheckConstraints.Length > 0 then
                        let lattice = 
                            c.CheckConstraints 
                            |> List.map Canon.Introspect.SqlParser.parseConstraint
                            |> List.reduce (fun a b -> Lattice.And(a, b))
                        let simplified = SemanticOptimizer.simplify lattice
                        if simplified = Lattice.False then
                            diagnostics.Add($"[DIAGNOSTIC CONTRADICTION] Table: {t.Name}, Column: {c.Name} has contradictory constraints that collapse to False.")

            // Generate Outputs
            let tsSb = System.Text.StringBuilder()
            let ktSb = System.Text.StringBuilder()
            let swSb = System.Text.StringBuilder()
            
            for t in tables do
                for c in t.Columns do
                    if not c.CheckConstraints.IsEmpty then
                        let lattice = 
                            c.CheckConstraints 
                            |> List.map (fun s -> if s.StartsWith("CHECK ") then s.Substring(6) else s)
                            |> List.map Canon.Introspect.SqlParser.parseConstraint 
                            |> List.reduce (fun a b -> Lattice.And(a, b))
                        let tsCode, _ = Transpiler.emitValidator $"{t.Name}_{c.Name}" lattice c.IsNullable
                        let ktCode, _ = KotlinTranspiler.emitValidator $"{t.Name}_{c.Name}" lattice c.IsNullable
                        let swCode, _ = SwiftTranspiler.emitValidator $"{t.Name}_{c.Name}" lattice c.IsNullable
                        tsSb.AppendLine(tsCode) |> ignore
                        ktSb.AppendLine(ktCode) |> ignore
                        swSb.AppendLine(swCode) |> ignore

            let fscheckCode = FsCheckEmitter.emitGenerators tables

            {| 
                typescript = tsSb.ToString()
                kotlin = ktSb.ToString()
                swift = swSb.ToString()
                fscheck = fscheckCode
                diagnostics = diagnostics.ToArray()
                error = null
            |}
        with ex ->
            {| 
                typescript = ""
                kotlin = ""
                swift = ""
                fscheck = ""
                diagnostics = [||]
                error = ex.Message
            |}
