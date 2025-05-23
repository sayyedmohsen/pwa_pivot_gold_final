
const apiKey = "8eca64515f2a4e58a6ee1152d5fc384b";
const symbol = "XAU/USD";

function getTodayUTCDate() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString().split("T")[0];
}

const today = getTodayUTCDate();
const cacheKey = "modified-" + today;

const cached = localStorage.getItem(cacheKey);
if (cached) {
  document.getElementById("modified-results").innerHTML = cached;
} else {
  fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&apikey=${apiKey}&outputsize=1`)
    .then(res => res.json())
    .then(data => {
      const values = data.values[0];
      const high = parseFloat(values.high);
      const low = parseFloat(values.low);
      const close = parseFloat(values.close);
      const open = parseFloat(values.open);

      const pivot = (high + low + close + open) / 4;
      const R1 = (2 * pivot) - low;
      const R2 = pivot + (high - low);
      const R3 = high + 2 * (pivot - low);
      const S1 = (2 * pivot) - high;
      const S2 = pivot - (high - low);
      const S3 = low - 2 * (high - pivot);

      const resultTable = `
        <table>
          <tr><th>Date (UTC)</th><th>Pivot</th><th>R1</th><th>R2</th><th>R3</th><th>S1</th><th>S2</th><th>S3</th></tr>
          <tr>
            <td>${today}</td>
            <td>${pivot.toFixed(2)}</td>
            <td>${R1.toFixed(2)}</td>
            <td>${R2.toFixed(2)}</td>
            <td>${R3.toFixed(2)}</td>
            <td>${S1.toFixed(2)}</td>
            <td>${S2.toFixed(2)}</td>
            <td>${S3.toFixed(2)}</td>
          </tr>
        </table>
      `;

      document.getElementById("modified-results").innerHTML = resultTable;
      localStorage.setItem(cacheKey, resultTable);

      const history = JSON.parse(localStorage.getItem('pivotHistory')) || [];
      history.unshift({
        date: today, R1: R1.toFixed(2), R2: R2.toFixed(2), R3: R3.toFixed(2),
        S1: S1.toFixed(2), S2: S2.toFixed(2), S3: S3.toFixed(2)
      });
      localStorage.setItem('pivotHistory', JSON.stringify(history.slice(0, 30)));
    })
    .catch(err => console.error("API error:", err));
}
