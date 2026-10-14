export function searchTransactions(item, query, caseinsensitive = true) {
    if (!query) return items;

    try {
        const flags = caseinsensitive ? "gi" : "g";
        const regex = new RegExp(query, flags);

        return items.filter((item) => 
            regex.test(`${item.description} ${item.amount} ${item.date}`));
    } 
}

export function highlight(text, query) {
    if (!query) return text;

    try {
        const regex = new RegExp(`(${query})`, "gi");
        return text.replace(regex, "<mark>$1</mark>");
    } catch {
        return text;
    }
}


