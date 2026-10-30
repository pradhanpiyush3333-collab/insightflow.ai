// =====================================================================
// InsightFlow AI - script.js
// This file: (1) holds the sample data, (2) calculates the metrics,
// (3) writes the results into index.html, (4) draws the chart,
// (5) reads an uploaded CSV file.
// =====================================================================

// ---------------------------------------------------------------------
// 1. SAMPLE DATA (DEMONSTRATION ONLY - not real sales)
// Each object is one order. Every number shown on the dashboard is
// calculated from this list, so edit it and the dashboard updates.
// ---------------------------------------------------------------------
const salesData = [
  { date: "2025-01-08", product: "Wireless Mouse",              quantity: 40, unitPrice: 25,  unitCost: 14  },
  { date: "2025-01-15", product: "Mechanical Keyboard",         quantity: 12, unitPrice: 80,  unitCost: 48  },
  { date: "2025-01-24", product: "Laptop Stand",                quantity: 25, unitPrice: 35,  unitCost: 19  },
  { date: "2025-02-05", product: "USB-C Hub",                   quantity: 30, unitPrice: 45,  unitCost: 26  },
  { date: "2025-02-14", product: "Noise-Cancelling Headphones", quantity: 9,  unitPrice: 120, unitCost: 72  },
  { date: "2025-02-26", product: "Wireless Mouse",              quantity: 35, unitPrice: 25,  unitCost: 14  },
  { date: "2025-03-04", product: "Monitor 27 Inch",             quantity: 6,  unitPrice: 230, unitCost: 160 },
  { date: "2025-03-17", product: "Desk Lamp",                   quantity: 28, unitPrice: 30,  unitCost: 15  },
  { date: "2025-03-28", product: "Webcam HD",                   quantity: 15, unitPrice: 60,  unitCost: 36  },
  { date: "2025-04-06", product: "Mechanical Keyboard",         quantity: 18, unitPrice: 80,  unitCost: 48  },
  { date: "2025-04-19", product: "USB-C Hub",                   quantity: 32, unitPrice: 45,  unitCost: 26  },
  { date: "2025-04-27", product: "Wireless Mouse",              quantity: 45, unitPrice: 25,  unitCost: 14  },
  { date: "2025-05-03", product: "Noise-Cancelling Headphones", quantity: 14, unitPrice: 120, unitCost: 72  },
  { date: "2025-05-16", product: "Laptop Stand",                quantity: 30, unitPrice: 35,  unitCost: 19  },
  { date: "2025-05-29", product: "Monitor 27 Inch",             quantity: 8,  unitPrice: 230, unitCost: 160 },
  { date: "2025-06-07", product: "Desk Lamp",                   quantity: 22, unitPrice: 30,  unitCost: 15  },
  { date: "2025-06-18", product: "Webcam HD",                   quantity: 20, unitPrice: 60,  unitCost: 36  },
  { date: "2025-06-25", product: "Wireless Mouse",              quantity: 38, unitPrice: 25,  unitCost: 14  },
  { date: "2025-07-09", product: "USB-C Hub",                   quantity: 34, unitPrice: 45,  unitCost: 26  },
  { date: "2025-07-21", product: "Mechanical Keyboard",         quantity: 16, unitPrice: 80,  unitCost: 48  },
  { date: "2025-07-30", product: "Laptop Stand",                quantity: 27, unitPrice: 35,  unitCost: 19  },
  { date: "2025-08-04", product: "Noise-Cancelling Headphones", quantity: 17, unitPrice: 120, unitCost: 72  },
  { date: "2025-08-13", product: "Wireless Mouse",              quantity: 50, unitPrice: 25,  unitCost: 14  },
  { date: "2025-08-27", product: "Monitor 27 Inch",             quantity: 10, unitPrice: 230, unitCost: 160 },
  { date: "2025-09-05", product: "Desk Lamp",                   quantity: 26, unitPrice: 30,  unitCost: 15  },
  { date: "2025-09-15", product: "Webcam HD",                   quantity: 18, unitPrice: 60,  unitCost: 36  },
  { date: "2025-09-26", product: "USB-C Hub",                   quantity: 36, unitPrice: 45,  unitCost: 26  },
  { date: "2025-10-08", product: "Mechanical Keyboard",         quantity: 20, unitPrice: 80,  unitCost: 48  },
  { date: "2025-10-19", product: "Wireless Mouse",              quantity: 42, unitPrice: 25,  unitCost: 14  },
  { date: "2025-10-28", product: "Laptop Stand",                quantity: 33, unitPrice: 35,  unitCost: 19  },
  { date: "2025-11-06", product: "Noise-Cancelling Headphones", quantity: 24, unitPrice: 120, unitCost: 72  },
  { date: "2025-11-17", product: "Monitor 27 Inch",             quantity: 13, unitPrice: 230, unitCost: 160 },
  { date: "2025-11-27", product: "USB-C Hub",                   quantity: 40, unitPrice: 45,  unitCost: 26  },
  { date: "2025-12-04", product: "Desk Lamp",                   quantity: 31, unitPrice: 30,  unitCost: 15  },
  { date: "2025-12-15", product: "Wireless Mouse",              quantity: 55, unitPrice: 25,  unitCost: 14  },
  { date: "2025-12-23", product: "Webcam HD",                   quantity: 22, unitPrice: 60,  unitCost: 36  }
];

// ---------------------------------------------------------------------
// 2. HELPERS
// ---------------------------------------------------------------------
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Turns 12345 into "$12,345". For Indian rupees use: "en-IN", currency "INR".
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

// ---------------------------------------------------------------------
// 3. CALCULATIONS - these functions turn raw orders into dashboard numbers
// ---------------------------------------------------------------------

// Adds up revenue and profit across every order.
function calculateSummary(sales) {
  let totalRevenue = 0;
  let totalProfit = 0;

  sales.forEach(function (order) {
    const revenue = order.quantity * order.unitPrice; // money received
    const cost = order.quantity * order.unitCost;     // money spent on the goods
    totalRevenue += revenue;
    totalProfit += revenue - cost;                    // profit = revenue - cost
  });

  return {
    totalRevenue: totalRevenue,
    totalOrders: sales.length, // one object in the list = one order
    totalProfit: totalProfit
  };
}

// Builds two lists of 12 numbers (Jan..Dec): revenue and profit per month.
function calculateMonthlyTotals(sales) {
  const revenue = new Array(12).fill(0);
  const profit = new Array(12).fill(0);

  sales.forEach(function (order) {
    // "2025-03-04" -> split on "-" -> ["2025","03","04"] -> month "03" -> index 2
    const monthIndex = Number(order.date.split("-")[1]) - 1;
    const orderRevenue = order.quantity * order.unitPrice;
    const orderCost = order.quantity * order.unitCost;

    revenue[monthIndex] += orderRevenue;
    profit[monthIndex] += orderRevenue - orderCost;
  });

  return { revenue: revenue, profit: profit };
}

// Groups orders by product name, then returns the best sellers by units sold.
function getTopProducts(sales, limit) {
  const totalsByProduct = {}; // example: { "Wireless Mouse": { units: 40, revenue: 1000 } }

  sales.forEach(function (order) {
    // First time we see this product: create an empty record for it.
    if (!totalsByProduct[order.product]) {
      totalsByProduct[order.product] = { name: order.product, units: 0, revenue: 0 };
    }
    totalsByProduct[order.product].units += order.quantity;
    totalsByProduct[order.product].revenue += order.quantity * order.unitPrice;
  });

  return Object.values(totalsByProduct)               // turn the object into a list
    .sort(function (a, b) { return b.units - a.units; }) // most units first
    .slice(0, limit);                                  // keep only the first 5
}

// ---------------------------------------------------------------------
// 4. SHOWING RESULTS ON THE PAGE
// ---------------------------------------------------------------------

// Writes the three summary numbers into the cards in index.html.
function renderSummaryCards(summary) {
  document.getElementById("total-revenue").textContent = currencyFormatter.format(summary.totalRevenue);
  document.getElementById("total-orders").textContent = summary.totalOrders.toLocaleString("en-US");
  document.getElementById("total-profit").textContent = currencyFormatter.format(summary.totalProfit);
}

// Creates one table row for each top product.
function renderTopProductsTable(products) {
  const tableBody = document.getElementById("top-products-body");
  tableBody.innerHTML = ""; // clear old rows

  products.forEach(function (product, index) {
    const row = document.createElement("tr");

    // textContent is used instead of innerHTML so text is never treated as HTML.
    const rankCell = document.createElement("td");
    rankCell.textContent = index + 1;

    const nameCell = document.createElement("td");
    nameCell.textContent = product.name;

    const unitsCell = document.createElement("td");
    unitsCell.className = "num";
    unitsCell.textContent = product.units.toLocaleString("en-US");

    const revenueCell = document.createElement("td");
    revenueCell.className = "num";
    revenueCell.textContent = currencyFormatter.format(product.revenue);

    row.append(rankCell, nameCell, unitsCell, revenueCell);
    tableBody.appendChild(row);
  });
}

// Draws the monthly chart with Chart.js (bars = revenue, line = profit).
function renderSalesChart(monthly) {
  // If the Chart.js file did not load (for example, no internet), show a message.
  if (typeof Chart === "undefined") {
    document.getElementById("chart-error").hidden = false;
    return;
  }

  const canvas = document.getElementById("sales-chart");

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: MONTH_LABELS,
      datasets: [
        {
          label: "Revenue",
          data: monthly.revenue,
          backgroundColor: "#3b5bdb",
          borderRadius: 6
        },
        {
          type: "line", // this dataset is drawn as a line on top of the bars
          label: "Profit",
          data: monthly.profit,
          borderColor: "#1a8f5c",
          backgroundColor: "#1a8f5c",
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // lets the chart fill the .chart-box height from CSS
      plugins: { legend: { position: "bottom" } },
      scales: {
        y: {
          beginAtZero: true,
          // Show axis numbers as $1,000 instead of 1000
          ticks: { callback: function (value) { return currencyFormatter.format(value); } }
        }
      }
    }
  });
}

// ---------------------------------------------------------------------
// 5. CSV UPLOAD (reads and checks the file; analysis will come later)
// ---------------------------------------------------------------------
const REQUIRED_COLUMNS = ["date", "product", "quantity", "unitPrice", "unitCost"];
let uploadedSales = []; // we will use this list in a future version

// Very simple CSV reader: splits text into lines, then each line by commas.
// (It does not support commas inside quoted values yet.)
function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map(function (h) { return h.trim(); });

  const rows = lines.slice(1).map(function (line) {
    const values = line.split(",");
    const row = {};
    headers.forEach(function (header, i) {
      row[header] = (values[i] || "").trim();
    });
    return row;
  });

  return { headers: headers, rows: rows };
}

function showUploadStatus(message, type) {
  const status = document.getElementById("upload-status");
  status.textContent = message;
  status.className = "status " + type; // "status success" or "status error"
}

function handleCsvUpload(event) {
  const file = event.target.files[0];
  if (!file) return; // user cancelled

  if (!file.name.toLowerCase().endsWith(".csv")) {
    showUploadStatus("Please choose a file that ends in .csv.", "error");
    return;
  }

  // FileReader reads the file in the browser. Nothing is sent to a server.
  const reader = new FileReader();

  reader.onload = function () {
    const result = parseCsv(reader.result);

    // Check that every required column exists in the header row.
    const missing = REQUIRED_COLUMNS.filter(function (col) {
      return !result.headers.includes(col);
    });

    if (missing.length > 0) {
      showUploadStatus("Missing column(s): " + missing.join(", ") + ".", "error");
      return;
    }

    uploadedSales = result.rows;
    showUploadStatus(
      "Loaded " + file.name + " with " + uploadedSales.length +
      " rows. Analysis of uploaded data is coming in a future version.",
      "success"
    );
  };

  reader.onerror = function () {
    showUploadStatus("Could not read that file. Please try again.", "error");
  };

  reader.readAsText(file);
}

// ---------------------------------------------------------------------
// 6. START THE DASHBOARD
// Runs once when the page loads: calculate everything, then display it.
// ---------------------------------------------------------------------
function initDashboard() {
  renderSummaryCards(calculateSummary(salesData));
  renderTopProductsTable(getTopProducts(salesData, 5));
  renderSalesChart(calculateMonthlyTotals(salesData));

  document.getElementById("csv-input").addEventListener("change", handleCsvUpload);
}

initDashboard();