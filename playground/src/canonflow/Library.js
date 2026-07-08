
import { parseSql } from "./DdlParser.js";
import { defaultOf, equals, disposeSafe, getEnumerator } from "./fable_modules/fable-library-js.5.6.0/Util.js";
import { isEmpty, map, reduce, length } from "./fable_modules/fable-library-js.5.6.0/List.js";
import { Lattice$1, SemanticOptimizer_simplify } from "./Canon.Core/Lattice.js";
import { parseConstraint } from "./Canon.Introspect/SqlParser.js";
import { StringBuilder__AppendLine_Z721C83C5, StringBuilder_$ctor } from "./fable_modules/fable-library-js.5.6.0/System.Text.js";
import { concat, substring } from "./fable_modules/fable-library-js.5.6.0/String.js";
import { emitValidator } from "./Canon.Fable/Transpiler.js";
import { emitValidator as emitValidator_1 } from "./Canon.Fable/KotlinTranspiler.js";
import { emitValidator as emitValidator_2 } from "./Canon.Fable/SwiftTranspiler.js";
import { emitGenerators } from "./Canon.Emit/FsCheckEmitter.js";
import { toString } from "./fable_modules/fable-library-js.5.6.0/Types.js";

export function transpile(sqlText) {
    try {
        const tables = parseSql(sqlText);
        const diagnostics = [];
        const enumerator = getEnumerator(tables);
        try {
            while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                const t = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
                const enumerator_1 = getEnumerator(t.Columns);
                try {
                    while (enumerator_1["System.Collections.IEnumerator.MoveNext"]()) {
                        const c = enumerator_1["System.Collections.Generic.IEnumerator`1.get_Current"]();
                        if (length(c.CheckConstraints) > 0) {
                            if (equals(SemanticOptimizer_simplify(reduce((a, b) => (new Lattice$1(4, [a, b])), map(parseConstraint, c.CheckConstraints))), new Lattice$1(1, []))) {
                                void (diagnostics.push(`[DIAGNOSTIC CONTRADICTION] Table: ${t.Name}, Column: ${c.Name} has contradictory constraints that collapse to False.`));
                            }
                        }
                    }
                }
                finally {
                    disposeSafe(enumerator_1);
                }
            }
        }
        finally {
            disposeSafe(enumerator);
        }
        const tsSb = StringBuilder_$ctor();
        const ktSb = StringBuilder_$ctor();
        const swSb = StringBuilder_$ctor();
        const enumerator_2 = getEnumerator(tables);
        try {
            while (enumerator_2["System.Collections.IEnumerator.MoveNext"]()) {
                const t_1 = enumerator_2["System.Collections.Generic.IEnumerator`1.get_Current"]();
                const enumerator_3 = getEnumerator(t_1.Columns);
                try {
                    while (enumerator_3["System.Collections.IEnumerator.MoveNext"]()) {
                        const c_1 = enumerator_3["System.Collections.Generic.IEnumerator`1.get_Current"]();
                        if (!isEmpty(c_1.CheckConstraints)) {
                            const lattice_1 = reduce((a_1, b_1) => (new Lattice$1(4, [a_1, b_1])), map(parseConstraint, map((s) => {
                                if (s.startsWith("CHECK ")) {
                                    return substring(s, 6);
                                }
                                else {
                                    return s;
                                }
                            }, c_1.CheckConstraints)));
                            const patternInput = emitValidator(concat(t_1.Name, "_", c_1.Name), lattice_1, c_1.IsNullable);
                            const patternInput_1 = emitValidator_1(concat(t_1.Name, "_", c_1.Name), lattice_1, c_1.IsNullable);
                            const patternInput_2 = emitValidator_2(concat(t_1.Name, "_", c_1.Name), lattice_1, c_1.IsNullable);
                            StringBuilder__AppendLine_Z721C83C5(tsSb, patternInput[0]);
                            StringBuilder__AppendLine_Z721C83C5(ktSb, patternInput_1[0]);
                            StringBuilder__AppendLine_Z721C83C5(swSb, patternInput_2[0]);
                        }
                    }
                }
                finally {
                    disposeSafe(enumerator_3);
                }
            }
        }
        finally {
            disposeSafe(enumerator_2);
        }
        const fscheckCode = emitGenerators(tables);
        const typescript = toString(tsSb);
        const kotlin = toString(ktSb);
        const swift = toString(swSb);
        return {
            diagnostics: diagnostics.slice(),
            error: defaultOf(),
            fscheck: fscheckCode,
            kotlin: kotlin,
            swift: swift,
            typescript: typescript,
        };
    }
    catch (ex) {
        return {
            diagnostics: [],
            error: ex.message,
            fscheck: "",
            kotlin: "",
            swift: "",
            typescript: "",
        };
    }
}

