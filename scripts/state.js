export function getState() {
    return transactions:
}

export function setState(data) {
    transactions = data;
}

export function addTransaction(transaction) {
    transactions.push(transaction);
}

export function updateTransaction(id,data) {
    transactions=transactions.map((transaction) => 
        item.id === id ? { ...item, ...data } : item
    );
}

export function deleteTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
}
