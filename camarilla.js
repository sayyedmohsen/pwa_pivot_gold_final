const apiKey = "8eca64515f2a4e58a6ee1152d5fc384b";
const symbol = "XAU/USD";

function getTodayUTCDate() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString().split("T")[0];
}

const today = getTodayUTCDate();
const cacheKey = "camarilla-" + today;

const cached = localStorage.getItem(cacheKey);
if (cached) {
  document.getElementById("camarilla-results").innerHTML = cached;
} else {
  fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&apikey=${apiKey}&outputsize=1`)
    .then(res => res.json())
    .then(data => {
      const values = data.values[0];
      const high = parseFloat(values.high);
      const low = parseFloat(values.low);
      const close = parseFloat(values.close);

      const range = high - low;

      // محاسبه سطوح کاماریلا
      const R4 = close + range * 1.1 / 8;
      const R3 = close + range * 1.1 / 2;
      const R2 = close + range * 1.1 / 4;
      const R1 = close + range * 1.1 / 6;
      const S1 = close - range * 1.1 / 6;
      const S2 = close - range * 1.1 / 4;
      const S3 = close - range * 1.1 / 2;
      const S4 = close - range * 1.1 / 8;

      // ساخت جدول نتایج
      const resultTable = `
        <table>
          <tr><th>Date (UTC)</th><th>R1</th><th>R2</th><th>R3</th><th>R4</th><th>S1</th><th>S2</th><th>S3</th><th>S4</th></tr>
          <tr>
            <td>${today}</td>
            <td>${R1.toFixed(2)}</td>
            <td>${R2.toFixed(2)}</td>
            <td>${R3.toFixed(2)}</td>
            <td>${R4.toFixed(2)}</td>
            <td>${S1.toFixed(2)}</td>
            <td>${S2.toFixed(2)}</td>
            <td>${S3.toFixed(2)}</td>
            <td>${S4.toFixed(2)}</td>
          </tr>
        </table>
      `;

      document.getElementById("camarilla-results").innerHTML = resultTable;
      localStorage.setItem(cacheKey, resultTable);
    })
    .catch(err => console.error("API error:", err));
}
