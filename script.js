const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const amountInput = document.getElementById("amount");
const result = document.getElementById("result");
const exchangeRateText = document.getElementById("exchange-rate");

fetch("https://api.exchangerate-api.com/v4/latest/USD")
  .then(res => res.json())
  .then(data => {
    const currencies = Object.keys(data.rates);
    currencies.forEach(currency => {
      fromCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
      toCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
    });
    fromCurrency.value = "USD";
    toCurrency.value = "INR";
    updateExchangeRate();
  });

document.getElementById("converter-form").addEventListener("submit", function (e) {
  e.preventDefault();
  convertCurrency();
});

function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (!amount) {
    result.innerText = "Please enter a valid amount.";
    return;
  }

  fetch(`https://api.exchangerate-api.com/v4/latest/${from}`)
    .then(res => res.json())
    .then(data => {
      const rate = data.rates[to];
      const converted = (amount * rate).toFixed(2);
      const output = `${amount} ${from} = ${converted} ${to}`;
      result.innerText = output;
      saveHistory(output);
    });
}

document.getElementById("swap").addEventListener("click", () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  updateExchangeRate();
  convertCurrency();
});

function updateExchangeRate() {
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (!from || !to) return;

  fetch(`https://api.exchangerate-api.com/v4/latest/${from}`)
    .then(res => res.json())
    .then(data => {
      const rate = data.rates[to];
      exchangeRateText.innerText = `1 ${from} = ${rate.toFixed(2)} ${to}`;
    });
}

fromCurrency.addEventListener("change", updateExchangeRate);
toCurrency.addEventListener("change", updateExchangeRate);

function saveHistory(entry) {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  history.unshift(entry);
  if (history.length > 5) history.pop();
  localStorage.setItem("history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  document.getElementById("history").innerHTML =
    "<h3>Recent Conversions:</h3>" + history.map(h => `<p>${h}</p>`).join("");
}
renderHistory();

document.getElementById("clear-history").addEventListener("click", () => {
  localStorage.removeItem("history");
  renderHistory();
});

