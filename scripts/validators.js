export function validDescription(description) {
    return /^\S(?:.*\S)?$/.test(value);
}

export function validAmount(value) {
    return /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value);
}

export function validDate(value) {
    return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value);
}

export function validCategory(value) {
    return /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/.test(value);
}

export function hasDuplicateWord(value) {
    return /\b(\w+)\s+\1\b/i.test(value);
}
