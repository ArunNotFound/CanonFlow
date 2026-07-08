
import { substring, replace, isNullOrEmpty } from "../fable_modules/fable-library-js.5.6.0/String.js";
import { replace as replace_1 } from "../fable_modules/fable-library-js.5.6.0/RegExp.js";
import { isDigit } from "../fable_modules/fable-library-js.5.6.0/Char.js";

export function sanitizeComment(text) {
    if (isNullOrEmpty(text)) {
        return text;
    }
    else {
        return replace(replace(replace(replace(replace(text, "/*", "/ *"), "*/", "* /"), "\n", " "), "\r", " "), "`", "\'");
    }
}

export function sanitizeIdentifier(name) {
    if (isNullOrEmpty(name)) {
        return "unnamed";
    }
    else {
        const clean = replace_1((name.length > 100) ? substring(name, 0, 100) : name, "[^a-zA-Z0-9_]", "_");
        if (isDigit(clean[0])) {
            return "_" + clean;
        }
        else {
            return clean;
        }
    }
}

