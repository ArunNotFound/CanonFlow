#r "nuget: FParsec"
#load "src/Canon.Core/Lattice.fs"
#load "src/Canon.Introspect/SqlParser.fs"
open Canon.Introspect
open Canon.Core
let test = "((age >= 18) AND (age < 120))"
printfn "%A" (SqlParser.parseConstraint test)
