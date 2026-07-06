namespace Canon.Introspect

open FParsec
open Canon.Core

module SqlParser =

    let pIdentifier = many1Chars (asciiLetter <|> digit <|> pchar '_')

    let pNumber = pfloat |>> decimal

    let ws = spaces

    let pGreaterThan = pstring ">" >>. ws >>. pNumber |>> fun num -> Lattice.Leaf (Range(Some(Exclusive num), None))
    let pGreaterThanOrEqual = pstring ">=" >>. ws >>. pNumber |>> fun num -> Lattice.Leaf (Range(Some(Inclusive num), None))
    let pLessThan = pstring "<" >>. ws >>. pNumber |>> fun num -> Lattice.Leaf (Range(None, Some(Exclusive num)))
    let pLessThanOrEqual = pstring "<=" >>. ws >>. pNumber |>> fun num -> Lattice.Leaf (Range(None, Some(Inclusive num)))

    let pOp = choice [ attempt pGreaterThanOrEqual; pGreaterThan; attempt pLessThanOrEqual; pLessThan ]

    let pCondition = 
        pIdentifier .>> ws >>= fun _ -> pOp

    let rec pExpr() =
        let pParen = between (pstring "(" >>. ws) (pstring ")" >>. ws) (delay pExpr)
        pParen <|> pCondition

    let parseConstraint (sql: string) =
        match run (ws >>. pExpr() .>> eof) sql with
        | Success(result, _, _) -> Some result
        | Failure(_, _, _) -> None
