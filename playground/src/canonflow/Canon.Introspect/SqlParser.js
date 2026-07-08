
import { substring, printf, toText } from "../fable_modules/fable-library-js.5.6.0/String.js";
import { tryParse } from "../fable_modules/fable-library-js.5.6.0/Decimal.js";
import Decimal from "../fable_modules/fable-library-js.5.6.0/Decimal.js";
import { uncurry2 } from "../fable_modules/fable-library-js.5.6.0/Util.js";
import { FSharpRef } from "../fable_modules/fable-library-js.5.6.0/Types.js";
import { Lattice_not, Lattice_or$0027, Lattice_and$0027, Lattice$1, Constraint, Bound$1 } from "../Canon.Core/Lattice.js";

export function ws() {
    return FParsec_CharParsers_spaces();
}

export const pIdentifier = (() => {
    let clo, clo_1;
    const unquoted = FParsec_Primitives_pipe2(FParsec_Primitives_op_LessBarGreater(FParsec_CharParsers_asciiLetter(), FParsec_CharParsers_pchar("_")), FParsec_CharParsers_manyChars(FParsec_Primitives_op_LessBarGreater(FParsec_Primitives_op_LessBarGreater(FParsec_CharParsers_asciiLetter(), FParsec_CharParsers_digit()), FParsec_CharParsers_pchar("_"))), (c, s) => (c + s));
    return FParsec_Primitives_op_LessBarGreater(FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_between(FParsec_CharParsers_pchar("\""), FParsec_CharParsers_pchar("\""), FParsec_CharParsers_many1Chars((clo = FParsec_CharParsers_noneOf("\"".split("")), clo))), (clo_1 = toText(printf("\"%s\"")), clo_1)), unquoted);
})();

export const pDecimal = (() => {
    const pNum = FParsec_CharParsers_many1Chars(FParsec_CharParsers_digit());
    const pFrac = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pchar("."), pNum), (s) => ("." + s));
    return FParsec_Primitives_pipe3(FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_opt(FParsec_CharParsers_pchar("-")), (_arg) => ((_arg == null) ? "" : "-")), pNum, FParsec_Primitives_opt(pFrac), (s_1, n, f) => ((f == null) ? (new Decimal(s_1 + n)) : (new Decimal((s_1 + n) + f))));
})();

export const pCast = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_opt(FParsec_Primitives_op_DotGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring("::"), FParsec_CharParsers_manyChars(FParsec_Primitives_op_LessBarGreater(FParsec_CharParsers_asciiLetter(), FParsec_CharParsers_pchar(" ")))), FParsec_Primitives_opt(FParsec_CharParsers_pstring("[]")))), (value) => {
});

export const pStringLiteral = FParsec_Primitives_between(FParsec_CharParsers_pstring("\'"), FParsec_CharParsers_pstring("\'"), FParsec_CharParsers_manyChars((() => {
    const clo = FParsec_CharParsers_noneOf("\'".split(""));
    return clo;
})()));

export const patternInput$004030 = FParsec_Primitives_createParserForwardedToRef();

export const pFieldRef = patternInput$004030[1];

export const pField = patternInput$004030[0];

pFieldRef.contents = FParsec_Primitives_op_DotGreaterGreater(FParsec_Primitives_op_LessBarGreater(FParsec_Primitives_op_LessBarGreater(FParsec_Primitives_attempt(FParsec_Primitives_between(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pchar("("), ws()), FParsec_Primitives_op_DotGreaterGreater(ws(), FParsec_CharParsers_pchar(")")), pField)), FParsec_Primitives_op_BarGreaterGreater(pStringLiteral, (() => {
    const clo = toText(printf("\'%s\'"));
    return clo;
})())), pIdentifier), pCast);

export const patternInput$004036$002D1 = FParsec_Primitives_createParserForwardedToRef();

export const pNumberValueRef = patternInput$004036$002D1[1];

export const pNumberValue = patternInput$004036$002D1[0];

pNumberValueRef.contents = FParsec_Primitives_op_DotGreaterGreater(FParsec_Primitives_op_LessBarGreater(FParsec_Primitives_op_LessBarGreater(FParsec_Primitives_attempt(FParsec_Primitives_between(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pchar("("), ws()), FParsec_Primitives_op_DotGreaterGreater(ws(), FParsec_CharParsers_pchar(")")), pNumberValue)), FParsec_Primitives_op_GreaterGreaterEquals(pStringLiteral, uncurry2((s) => {
    let matchValue;
    let outArg = new Decimal("0");
    matchValue = [tryParse(s, new FSharpRef(() => outArg, (v) => {
        outArg = v;
    })), outArg];
    return matchValue[0] ? FParsec_Primitives_preturn(matchValue[1]) : FParsec_Primitives_pzero();
}))), pDecimal), pCast);

export const pGreaterThan = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring(">"), ws()), pNumberValue), (num) => (new Constraint(0, [new Bound$1(1, [num]), undefined])));

export const pGreaterThanOrEqual = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring(">="), ws()), pNumberValue), (num) => (new Constraint(0, [new Bound$1(0, [num]), undefined])));

export const pLessThan = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring("<"), ws()), pNumberValue), (num) => (new Constraint(0, [undefined, new Bound$1(1, [num])])));

export const pLessThanOrEqual = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring("<="), ws()), pNumberValue), (num) => (new Constraint(0, [undefined, new Bound$1(0, [num])])));

export const pStrGreaterThan = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring(">"), ws()), pStringLiteral), (str) => (new Constraint(2, [new Bound$1(1, [str]), undefined])));

export const pStrGreaterThanOrEqual = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring(">="), ws()), pStringLiteral), (str) => (new Constraint(2, [new Bound$1(0, [str]), undefined])));

export const pStrLessThan = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring("<"), ws()), pStringLiteral), (str) => (new Constraint(2, [undefined, new Bound$1(1, [str])])));

export const pStrLessThanOrEqual = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring("<="), ws()), pStringLiteral), (str) => (new Constraint(2, [undefined, new Bound$1(0, [str])])));

export const pOp = (() => {
    const clo = FParsec_Primitives_choice([FParsec_Primitives_attempt(pGreaterThanOrEqual), FParsec_Primitives_attempt(pGreaterThan), FParsec_Primitives_attempt(pLessThanOrEqual), FParsec_Primitives_attempt(pLessThan), FParsec_Primitives_attempt(pStrGreaterThanOrEqual), FParsec_Primitives_attempt(pStrGreaterThan), FParsec_Primitives_attempt(pStrLessThanOrEqual), FParsec_Primitives_attempt(pStrLessThan)]);
    return clo;
})();

export const pAnyArray = FParsec_Primitives_op_BarGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_Primitives_op_GreaterGreaterDot(FParsec_Primitives_op_GreaterGreaterDot(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring("="), ws()), FParsec_CharParsers_pstring("ANY")), ws()), FParsec_Primitives_between(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pchar("("), ws()), FParsec_Primitives_op_DotGreaterGreater(ws(), FParsec_CharParsers_pchar(")")), FParsec_Primitives_op_DotGreaterGreater(FParsec_Primitives_between(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pchar("("), ws()), FParsec_Primitives_op_DotGreaterGreater(ws(), FParsec_CharParsers_pchar(")")), FParsec_Primitives_op_DotGreaterGreater(FParsec_Primitives_op_DotGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring("ARRAY["), ws()), FParsec_Primitives_sepBy(FParsec_Primitives_op_DotGreaterGreater(pStringLiteral, pCast), FParsec_Primitives_op_DotGreaterGreater(FParsec_Primitives_op_DotGreaterGreater(ws(), FParsec_CharParsers_pstring(",")), ws()))), ws()), FParsec_CharParsers_pstring("]"))), pCast))), (Item) => (new Constraint(5, [Item])));

export const pRelative = FParsec_Primitives_pipe3(FParsec_Primitives_op_DotGreaterGreater(pField, ws()), FParsec_Primitives_op_DotGreaterGreater((() => {
    const clo = FParsec_Primitives_choice([FParsec_Primitives_attempt(FParsec_CharParsers_pstring(">=")), FParsec_CharParsers_pstring(">"), FParsec_Primitives_attempt(FParsec_CharParsers_pstring("<=")), FParsec_CharParsers_pstring("<")]);
    return clo;
})(), ws()), pField, (colA, op, colB) => (new Lattice$1(2, [new Constraint(6, [colA, op, colB])])));

export const pIsNull = FParsec_Primitives_pipe2(FParsec_Primitives_op_DotGreaterGreater(pField, ws()), FParsec_CharParsers_pstring("IS NULL"), (f, _arg) => (new Lattice$1(2, [new Constraint(9, [toText(printf("%s IS NULL"))(f)])])));

export const pIsNotNull = FParsec_Primitives_pipe2(FParsec_Primitives_op_DotGreaterGreater(pField, ws()), FParsec_CharParsers_pstring("IS NOT NULL"), (f, _arg) => (new Lattice$1(2, [new Constraint(9, [toText(printf("%s IS NOT NULL"))(f)])])));

export const pCondition = FParsec_Primitives_op_LessBarGreater(FParsec_Primitives_op_LessBarGreater(FParsec_Primitives_op_LessBarGreater(FParsec_Primitives_op_LessBarGreater(FParsec_Primitives_attempt(FParsec_Primitives_pipe2(FParsec_Primitives_op_DotGreaterGreater(pField, ws()), pAnyArray, (ident, inset) => (new Lattice$1(2, [new Constraint(10, [ident, inset])])))), FParsec_Primitives_attempt(FParsec_Primitives_pipe2(FParsec_Primitives_op_DotGreaterGreater(pField, ws()), pOp, (ident_1, op) => (new Lattice$1(2, [new Constraint(10, [ident_1, op])]))))), FParsec_Primitives_attempt(pRelative)), FParsec_Primitives_attempt(pIsNotNull)), pIsNull);

export const opp = FParsec_OperatorPrecedenceParser$3_$ctor();

export const pExpr = FParsec_OperatorPrecedenceParser$3__get_ExpressionParser(opp);

FParsec_OperatorPrecedenceParser$3__set_TermParser_7407E482(opp, FParsec_Primitives_op_LessBarGreater(FParsec_Primitives_attempt(pCondition), FParsec_Primitives_between(FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring("("), ws()), FParsec_Primitives_op_GreaterGreaterDot(FParsec_CharParsers_pstring(")"), ws()), pExpr)));

FParsec_OperatorPrecedenceParser$3__AddOperator_Z45408AA3(opp, FParsec_InfixOperator$3_$ctor_2F156300("AND", ws(), 2, 1, Lattice_and$0027));

FParsec_OperatorPrecedenceParser$3__AddOperator_Z45408AA3(opp, FParsec_InfixOperator$3_$ctor_2F156300("OR", ws(), 1, 1, Lattice_or$0027));

FParsec_OperatorPrecedenceParser$3__AddOperator_Z45408AA3(opp, FParsec_PrefixOperator$3_$ctor_61FBAB38("NOT", ws(), 3, true, Lattice_not));

export function parseConstraint(sql) {
    const stripOuter = (s_mut) => {
        stripOuter:
        while (true) {
            const s = s_mut;
            const trimmed = s.trim();
            if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
                let openCount = 0;
                let isWrapped = true;
                for (let i = 0; i <= (trimmed.length - 2); i++) {
                    if (trimmed[i] === "(") {
                        openCount = ((openCount + 1) | 0);
                    }
                    else if (trimmed[i] === ")") {
                        openCount = ((openCount - 1) | 0);
                    }
                    if (openCount === 0) {
                        isWrapped = false;
                    }
                }
                if (isWrapped) {
                    s_mut = substring(trimmed, 1, trimmed.length - 2);
                    continue stripOuter;
                }
                else {
                    return trimmed;
                }
            }
            else {
                return trimmed;
            }
            break;
        }
    };
    const cleanSql = stripOuter(sql);
    const matchValue = FParsec_CharParsers_run(FParsec_Primitives_op_DotGreaterGreater(FParsec_Primitives_op_GreaterGreaterDot(ws(), pExpr), FParsec_CharParsers_eof()), cleanSql);
    if (matchValue.tag === 1) {
        return new Lattice$1(2, [new Constraint(9, [sql])]);
    }
    else {
        return matchValue.fields[0];
    }
}

