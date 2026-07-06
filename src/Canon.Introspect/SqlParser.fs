namespace Canon.Introspect

open FParsec
open Canon.Core

module SqlParser =

    let ws = spaces

    let pIdentifier = 
        pipe2 (asciiLetter <|> pchar '_') (manyChars (asciiLetter <|> digit <|> pchar '_')) (fun c s -> string c + s)

    let pDecimal = 
        let pNum = many1Chars (digit)
        let pFrac = pchar '.' >>. pNum |>> fun s -> "." + s
        let pSign = opt (pchar '-') |>> function Some _ -> "-" | None -> ""
        pipe3 pSign pNum (opt pFrac) (fun s n f -> 
            match f with
            | Some frac -> decimal (s + n + frac)
            | None -> decimal (s + n)
        )

    let pCast = opt (pstring "::" >>. manyChars (asciiLetter <|> pchar ' ' <|> pchar '[' <|> pchar ']')) |>> ignore

    let pField, pFieldRef = createParserForwardedToRef()
    pFieldRef.Value <- 
        (attempt (between (pchar '(' >>. ws) (ws .>> pchar ')') pField) <|> pIdentifier) .>> pCast

    let pNumberValue =
        (attempt (between (pchar '(' >>. ws) (ws .>> pchar ')') pDecimal) <|> pDecimal) .>> pCast

    let pGreaterThan = pstring ">" >>. ws >>. pNumberValue |>> fun num -> Range(Some(Exclusive num), None)
    let pGreaterThanOrEqual = pstring ">=" >>. ws >>. pNumberValue |>> fun num -> Range(Some(Inclusive num), None)
    let pLessThan = pstring "<" >>. ws >>. pNumberValue |>> fun num -> Range(None, Some(Exclusive num))
    let pLessThanOrEqual = pstring "<=" >>. ws >>. pNumberValue |>> fun num -> Range(None, Some(Inclusive num))

    let pOp = choice [ attempt pGreaterThanOrEqual; pGreaterThan; attempt pLessThanOrEqual; pLessThan ]

    let pStringLiteral = 
        between (pstring "'") (pstring "'") (manyChars (noneOf "'"))

    let pAnyArray = 
        pstring "=" >>. ws >>. pstring "ANY" >>. ws >>. 
        between (pchar '(' >>. ws) (ws .>> pchar ')') (
            between (pchar '(' >>. ws) (ws .>> pchar ')') (
                pstring "ARRAY[" >>. ws >>. sepBy (pStringLiteral .>> pCast) (ws .>> pstring "," .>> ws) .>> ws .>> pstring "]"
            ) .>> pCast
        ) |>> InSet

    let pRelative =
        pipe3 (pField .>> ws) (choice [attempt (pstring ">="); pstring ">"; attempt (pstring "<="); pstring "<"] .>> ws) pField
            (fun colA op colB -> Lattice.Leaf (RelativeBound(colA, op, colB)))

    let pCondition = 
        attempt pRelative <|>
        attempt (pipe2 (pField .>> ws) pAnyArray (fun ident inset -> Lattice.Leaf (FieldBound(ident, inset)))) <|>
        pipe2 (pField .>> ws) pOp (fun ident op -> Lattice.Leaf (FieldBound(ident, op)))

    let opp = new OperatorPrecedenceParser<Lattice<Constraint>, unit, unit>()
    let pExpr = opp.ExpressionParser
    opp.TermParser <- attempt pCondition <|> between (pstring "(" >>. ws) (pstring ")" >>. ws) pExpr

    opp.AddOperator(InfixOperator("AND", ws, 2, Associativity.Left, Lattice.and'))
    opp.AddOperator(InfixOperator("OR", ws, 1, Associativity.Left, Lattice.or'))
    opp.AddOperator(PrefixOperator("NOT", ws, 3, true, Lattice.not))

    let parseConstraint (sql: string) =
        let rec stripOuter (s: string) =
            let trimmed = s.Trim()
            if trimmed.StartsWith("(") && trimmed.EndsWith(")") then
                let mutable openCount = 0
                let mutable isWrapped = true
                for i = 0 to trimmed.Length - 2 do
                    if trimmed.[i] = '(' then openCount <- openCount + 1
                    elif trimmed.[i] = ')' then openCount <- openCount - 1
                    if openCount = 0 then isWrapped <- false
                
                if isWrapped then
                    let inner = trimmed.Substring(1, trimmed.Length - 2)
                    stripOuter inner
                else trimmed
            else
                trimmed
                
        let cleanSql = stripOuter sql
        match run (ws >>. pExpr .>> eof) cleanSql with
        | Success(result, _, _) -> result
        | Failure(_, _, _) -> Lattice.Leaf(Opaque sql)
