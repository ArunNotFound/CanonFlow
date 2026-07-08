
import { concat } from "../fable_modules/fable-library-js.5.6.0/String.js";
import { sanitizeComment } from "./Sanitizer.js";
import { Record, Union } from "../fable_modules/fable-library-js.5.6.0/Types.js";
import { list_type, float64_type, bool_type, record_type, union_type, string_type } from "../fable_modules/fable-library-js.5.6.0/Reflection.js";
import { Lattice$1_$reflection, Constraint_$reflection } from "./Lattice.js";

/**
 * Represents the translation fidelity of a constraint into a target language.
 */
export class Fidelity extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Exact", "Approximate", "Unsupported"];
    }
    toString() {
        const this$ = this;
        return (this$.tag === 1) ? concat("Approximate: ", sanitizeComment(this$.fields[0])) : ((this$.tag === 2) ? concat("Unsupported: ", sanitizeComment(this$.fields[0])) : "Exact");
    }
}

export function Fidelity_$reflection() {
    return union_type("Canon.Core.Fidelity", [], Fidelity, () => [[], [["reason", string_type]], [["reason", string_type]]]);
}

export class ConstraintFidelity extends Record {
    constructor(Constraint, Fidelity, Target) {
        super();
        this.Constraint = Constraint;
        this.Fidelity = Fidelity;
        this.Target = Target;
    }
}

export function ConstraintFidelity_$reflection() {
    return record_type("Canon.Core.ConstraintFidelity", [], ConstraintFidelity, () => [["Constraint", Lattice$1_$reflection(Constraint_$reflection())], ["Fidelity", Fidelity_$reflection()], ["Target", string_type]]);
}

export function FidelityModule_combine(f1, f2) {
    let matchResult, r1, r2, r, r1_1, r2_1, r_1;
    switch (f1.tag) {
        case 1: {
            switch (f2.tag) {
                case 2: {
                    matchResult = 1;
                    r = f2.fields[0];
                    break;
                }
                case 1: {
                    matchResult = 2;
                    r1_1 = f1.fields[0];
                    r2_1 = f2.fields[0];
                    break;
                }
                default: {
                    matchResult = 3;
                    r_1 = f1.fields[0];
                }
            }
            break;
        }
        case 0: {
            switch (f2.tag) {
                case 1: {
                    matchResult = 3;
                    r_1 = f2.fields[0];
                    break;
                }
                case 0: {
                    matchResult = 4;
                    break;
                }
                default: {
                    matchResult = 1;
                    r = f2.fields[0];
                }
            }
            break;
        }
        default:
            switch (f2.tag) {
                case 2: {
                    matchResult = 0;
                    r1 = f1.fields[0];
                    r2 = f2.fields[0];
                    break;
                }
                case 1: {
                    matchResult = 1;
                    r = f1.fields[0];
                    break;
                }
                default: {
                    matchResult = 1;
                    r = f1.fields[0];
                }
            }
    }
    switch (matchResult) {
        case 0:
            return new Fidelity(2, [concat(r1, "; ", r2)]);
        case 1:
            return new Fidelity(2, [r]);
        case 2:
            return new Fidelity(1, [concat(r1_1, "; ", r2_1)]);
        case 3:
            return new Fidelity(1, [r_1]);
        default:
            return new Fidelity(0, []);
    }
}

export class FidelityReport extends Record {
    constructor(Schema, Passed, Score, LostMeaning) {
        super();
        this.Schema = Schema;
        this.Passed = Passed;
        this.Score = Score;
        this.LostMeaning = LostMeaning;
    }
}

export function FidelityReport_$reflection() {
    return record_type("Canon.Core.FidelityReport", [], FidelityReport, () => [["Schema", string_type], ["Passed", bool_type], ["Score", float64_type], ["LostMeaning", list_type(string_type)]]);
}

/**
 * Lineage grade indicates the degree of trust/verification for a field or constraint.
 * Inspired by Symphony's Lineage concepts.
 */
export class LineageGrade extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Exact", "Declared", "Opaque"];
    }
}

export function LineageGrade_$reflection() {
    return union_type("Canon.Core.LineageGrade", [], LineageGrade, () => [[], [], []]);
}

