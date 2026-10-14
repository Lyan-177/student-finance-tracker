import { gettransactions, savetransactions} from './transaction.js';
import { getState, getstate, savestate } from './state.js';
import {
    validDescription,
    validAmount,
    validDate,
    validCategory,
    validType, 
} from './validators.js';
import { searchTransactions, highlight} from './search.js';

const form = document.querySelector("#finance-form");
const list = document.querySelector("#transaction-list");
const search = document.querySelector("#search-input");
const caseBox = document.querySelector("#case-insensitive");
const sort = document.querySelector("#sort-select");

setState(getTransactions());

function render() {
    let items = [...getState()];
    items = searchTransactions(items, search.value, caseBox.checked);
    if (sort.value === "date-desc")
        items.sort((a, b) => b.date.localeCompare(a.date));
    if (sort.value === "date-asc")
        items.sort((a, b) => a.date.localeCompare(b.date));
    if (sort.value === "amount-desc")
        items.sort((a, b) => b.amount - a.amount);
    if (sort.value === "amount-asc")
        items.sort((a, b) => a.amount - b.amount);
    if (sort.value === "category")
        items.sort((a, b) => a.category.localeCompare(b.category));

    list .innerHTML = items.map((item) => `
        <tr>
            <td>${highlight(item.description, search.value,)}</td>
            <td>${item.amount.toFixed(2)}</td>
            <td>${item.date}</td>
            <td>${highlight(item.category, search.value)}</td> 
            <td>
                <button onClick="deleteitem(`${item.id}`)">
                    Delete
                </button>
            </td>
        </tr>
    `).join('');
    document.querySelector("#total-records").textContent = getState().length;

    const total = getState().reduce((sum, item) => sum + item.amount, 0);
    document.querySelector("#total-spending").textContent = total.toFixed(2);

    const categories = {};
    getState().array.forEach(element => {
        categories[item.category] = (categories[item.category] || 0) + item.amount;
    });

    const top = object.entries(categories).sort((a,b) => b[1] - a[1])[0];
    document.querySelector("#top-category").textContent = top ? top [0] : "None";

    document.querySelector("#seven-day-trend").textContent =
        getState()
        .filter(item => {
            const days = ((Date.now()) - new Date(item.date)) / 86400000;
            return days <= 7;
        })
        .reduce((sum, item) => sum + item.amount, 0)
        .toFixed(2);
}

form.addEventListener("submit", e => {
    e.preventDefault();

    const description = document.querySelector("#description").value.trim();
    const amount = parseFloat(document.querySelector("#amount").value);
    const category = document.querySelector("#category").value.trim();
    const date = document.querySelector("#date").value;
    
    if (
        !validDescription(description) ||
        !validAmount(amount) ||
        !validCategory(category) ||
        !validDate(date)
    ) {
        document.querySelector("#form-message").textContent = 
        "Please enter valid information.";
        return;
    }
    const transaction = {
        id: "rec_" + Date.now(),
        description,
        amount: Number(amount),
        category,
        date,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    setState([...getState(), transaction]);
    saveTransactions(getState());
    form.reset();

    document.querySelector("#form-message").textContent = 
        "Transaction saved.";
    render();
})

window.deleteItem = id => {
    setState(getState().filter(item => item.id !== id));
    saveTransactions(getState());
    render();
};

search.addEventListener("input", render);
caseBox.addEventListener("change", render);
sort.addEventListener("change", render);

render();

const settings = document.querySelector("#settings-form");
settings.addEventListener("submit", e => {
    e.preventDefault();
    const budget = Number(document.querySelector("#budget-cap").value);
    localStorage.setItem("budget", budget);

    const total = getState().reduce((sum, item) => sum + item.amount, 0);
    document.querySelector("#budget-status").textContent =
        total > budget ? "Over by " + (total - budget).toFixed(2) : "Remaining: $" + (budget - total).toFixed(2);

});

document.querySelector("#export-json").onClick = () => {
    const data = JSON.stringify(getState(), null, 2);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([data]));
    a.download = "transaction.json";
    a.click();
};

document.querySelector("#json-import").onchange = async e => {
  try {
    const data = JSON.parse(await e.target.files[0].text());

    if (!Array.isArray(data)) throw new Error();

    setState(data);
    saveTransactions(data);
    render();

    document.querySelector("#import-message").textContent =
      "Import successful.";
  } catch {
    document.querySelector("#import-message").textContent =
      "Invalid JSON file.";
  }
};

const currencyForm = document.querySelector("#settings-form");

currencyForm.addEventListener("submit", () => {
  localStorage.setItem("currency", document.querySelector("#base-currency").value);
  localStorage.setItem("rate1", document.querySelector("#currency-rate-1").value);
  localStorage.setItem("rate2", document.querySelector("#currency-rate-2").value);
});