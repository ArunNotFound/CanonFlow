#r "nuget: FParsec"
#load "src/Canon.Core/Lattice.fs"
#load "src/Canon.Introspect/SqlParser.fs"
open Canon.Introspect
open Canon.Core
let test = "((currency = ANY (ARRAY['INR'::bpchar, 'USD'::bpchar, 'EUR'::bpchar])))"
printfn "%A" (SqlParser.parseConstraint test)
