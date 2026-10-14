const KEY = "StudentFinance"

export function getTransactions() {
    return JSON.parse(localStorage.getItem(KEY) || "[]")
}

export function saveTransactions(transactions) {
    localStorage.setItem(KEY, JSON.stringify(transactions))
}

export function clearTransaction(transaction) {
    localStorage.removeItem(KEY);
}


