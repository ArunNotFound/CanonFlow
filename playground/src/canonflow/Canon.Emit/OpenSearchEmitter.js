
import { map } from "../fable_modules/fable-library-js.5.6.0/List.js";
import { join, concat } from "../fable_modules/fable-library-js.5.6.0/String.js";
import { Fidelity } from "../Canon.Core/Lineage.js";
import { class_type } from "../fable_modules/fable-library-js.5.6.0/Reflection.js";

/**
 * Emits an OpenSearch/Elasticsearch index mapping derived from the domain schema.
 * Converts typed fields into strict OpenSearch field types.
 */
export class OpenSearchEmitter {
    constructor() {
    }
    Emit(tables) {
        const this$ = this;
        return map((table) => [concat("{\n  \"mappings\": {\n    \"properties\": {\n", join(",\n", map((col) => (`        "${col.Name}": { "type": "${OpenSearchEmitter__mapDataType_Z721C83C5(this$, col.DataType)}" }`), table.Columns)), "\n    }\n  }\n}"), new Fidelity(1, ["OpenSearch drops foreign keys, constraints, and defaults"])], tables);
    }
}

export function OpenSearchEmitter_$reflection() {
    return class_type("Canon.Emit.OpenSearch.OpenSearchEmitter", undefined, OpenSearchEmitter);
}

export function OpenSearchEmitter_$ctor() {
    return new OpenSearchEmitter();
}

export function OpenSearchEmitter__mapDataType_Z721C83C5(this$, sqlType) {
    const matchValue = sqlType.toLowerCase();
    switch (matchValue) {
        case "integer":
        case "int":
            return "integer";
        case "bigint":
            return "long";
        case "boolean":
            return "boolean";
        case "timestamp":
        case "date":
            return "date";
        case "decimal":
        case "numeric":
            return "double";
        default:
            return "keyword";
    }
}

