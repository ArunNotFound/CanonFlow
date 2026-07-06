namespace Canon.Core

/// Represents Helios capability-typed field kinds for semantic indexing.
type FieldKind =
    | Keyword
    | Text
    | TextWithKeyword
    | Date
    | Numeric
    | Bool
    | Nested

/// Represents boundary definitions for Symphony constraints.
type Bound<'T> =
    | Inclusive of 'T
    | Exclusive of 'T

/// Defines common validation constraints that can be used as Leaves in our Lattice (Symphony model).
type Constraint =
    | Range of lo: Bound<decimal> option * hi: Bound<decimal> option
    | IntRange of lo: Bound<int64> option * hi: Bound<int64> option
    | MaxLength of int
    | InList of string list
    | NonEmpty
    | PrimaryKey
    | Opaque of string
    | FieldBound of string * Constraint

/// A closed six-constructor bounded complemented lattice for query formulation.
type Lattice<'Leaf> =
    | True
    | False
    | Leaf of 'Leaf
    | Not of Lattice<'Leaf>
    | And of Lattice<'Leaf> * Lattice<'Leaf>
    | Or of Lattice<'Leaf> * Lattice<'Leaf>

[<RequireQualifiedAccess>]
module Lattice =
    let not l =
        match l with
        | True -> False
        | False -> True
        | Not x -> x
        | _ -> Not l

    let and' left right =
        match left, right with
        | True, x | x, True -> x
        | False, _ | _, False -> False
        | _ -> And(left, right)

    let or' left right =
        match left, right with
        | True, _ | _, True -> True
        | False, x | x, False -> x
        | _ -> Or(left, right)

    let rec toNNF (l: Lattice<'Leaf>) : Lattice<'Leaf> =
        match l with
        | True -> True
        | False -> False
        | Leaf c -> Leaf c
        | And(a, b) -> And(toNNF a, toNNF b)
        | Or(a, b) -> Or(toNNF a, toNNF b)
        | Not inner ->
            match inner with
            | True -> False
            | False -> True
            | Leaf c -> Not (Leaf c)
            | Not x -> toNNF x
            | And(a, b) -> Or(toNNF (Not a), toNNF (Not b))
            | Or(a, b) -> And(toNNF (Not a), toNNF (Not b))

    let rec eval (evalLeaf: 'Leaf -> bool) (l: Lattice<'Leaf>) =
        match l with
        | True -> true
        | False -> false
        | Leaf x -> evalLeaf x
        | Not x -> Operators.not (eval evalLeaf x)
        | And(a, b) -> (eval evalLeaf a) && (eval evalLeaf b)
        | Or(a, b) -> (eval evalLeaf a) || (eval evalLeaf b)

    let equivalent (a: Lattice<'Leaf>) (b: Lattice<'Leaf>) (evalLeaf: 'Leaf -> bool) =
        eval evalLeaf a = eval evalLeaf b

/// Phantom-typed query shell.
type Query<'doc, 'Leaf> = {
    Predicate: Lattice<'Leaf>
}
