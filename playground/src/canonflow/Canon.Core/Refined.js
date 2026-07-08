
import { Record } from "../fable_modules/fable-library-js.5.6.0/Types.js";
import { Lattice$1_$reflection, Constraint_$reflection } from "./Lattice.js";
import { record_type } from "../fable_modules/fable-library-js.5.6.0/Reflection.js";
import { FSharpResult$2 } from "../fable_modules/fable-library-js.5.6.0/Result.js";

/**
 * A refined type containing a value that has been proven to satisfy the Lattice<Constraint>.
 * Replaces OO IPredicate shell with pure functional data.
 */
export class Refined$2 extends Record {
    constructor(Value, Predicate) {
        super();
        this.Value = Value;
        this.Predicate = Predicate;
    }
}

export function Refined$2_$reflection(gen0, gen1) {
    return record_type("Canon.Core.Refined`2", [gen0, gen1], Refined$2, () => [["Value", gen0], ["Predicate", Lattice$1_$reflection(Constraint_$reflection())]]);
}

export function Refined$2__Get(this$) {
    return this$.Value;
}

export function Refined$2__get_Schema(this$) {
    return this$.Predicate;
}

/**
 * Attempts to lift a value into a Refined type given a predicate and an evaluation function.
 */
export function Refined_create(eval$, predicate, value) {
    if (eval$(value, predicate)) {
        return new FSharpResult$2(0, [new Refined$2(value, predicate)]);
    }
    else {
        return new FSharpResult$2(1, ["Validation failed for structural constraints"]);
    }
}

