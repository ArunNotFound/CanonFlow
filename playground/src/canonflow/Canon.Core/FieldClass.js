
import { Union } from "../fable_modules/fable-library-js.5.6.0/Types.js";
import { union_type, string_type } from "../fable_modules/fable-library-js.5.6.0/Reflection.js";

/**
 * Classifies the fidelity of mapping a domain field to/from a storage field.
 */
export class FieldClass extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Lossless", "Widened", "Narrowed", "Unrepresentable"];
    }
}

export function FieldClass_$reflection() {
    return union_type("Canon.Core.FieldClass", [], FieldClass, () => [[], [["reason", string_type]], [["reason", string_type]], [["reason", string_type]]]);
}

