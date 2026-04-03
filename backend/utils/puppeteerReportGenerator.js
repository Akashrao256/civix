const fs = require("fs/promises");
const path = require("path");
const puppeteer = require("puppeteer");

const TEMPLATE_PATH = path.join(__dirname, "..", "templates", "report.html");
const CHART_SCRIPT_PATH = path.join(
  path.dirname(require.resolve("chart.js")),
  "chart.umd.js",
);
const CHART_RENDER_TIMEOUT_MS = 15000;

const getNormalizedReport = (data = {}) => {
  const summary = data.summary || {};
  const status = data.statusBreakdown || {};

  return {
    month: data.month || data.meta?.month || "Unknown",
    generatedAt: data.meta?.generatedAt || new Date(),
    totalPetitions: Number(data.totalPetitions ?? summary.totalPetitions ?? 0),
    activePetitions: Number(data.activePetitions ?? status.active ?? 0),
    underReviewPetitions: Number(
      data.underReviewPetitions ?? status.underReview ?? 0,
    ),
    pendingPetitions: Number(data.pendingPetitions ?? status.pending ?? 0),
    closedPetitions: Number(data.closedPetitions ?? status.closed ?? 0),
    totalSignatures: Number(
      data.totalSignatures ?? summary.totalSignatures ?? 0,
    ),
    totalPolls: Number(data.totalPolls ?? summary.totalPolls ?? 0),
    totalVotes: Number(data.totalVotes ?? summary.totalVotes ?? 0),
  };
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const getPetitionCards = (report) => [
  {
    label: "Total Petitions",
    value: report.totalPetitions,
    icon: "&#128203;",
    gradient: "linear-gradient(135deg, #0ea5e9, #2563eb)",
  },
  {
    label: "Active Petitions",
    value: report.activePetitions,
    icon: "&#128293;",
    gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  },
  {
    label: "Under Review",
    value: report.underReviewPetitions,
    icon: "&#128269;",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
  },
  {
    label: "Pending",
    value: report.pendingPetitions,
    icon: "&#9203;",
    gradient: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
  },
  {
    label: "Closed Petitions",
    value: report.closedPetitions,
    icon: "&#128274;",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
  },
  {
    label: "Total Signatures",
    value: report.totalSignatures,
    icon: "&#9997;&#65039;",
    gradient: "linear-gradient(135deg, #60a5fa, #1d4ed8)",
  },
];

const getPollCards = (report) => [
  {
    label: "Total Polls",
    value: report.totalPolls,
    icon: "&#128202;",
    gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
  },
  {
    label: "Total Votes Cast",
    value: report.totalVotes,
    icon: "&#128499;&#65039;",
    gradient: "linear-gradient(135deg, #ec4899, #db2777)",
  },
];

const renderStatCards = (cards) =>
  cards
    .map(
      (card) => `
        <article class="stat-card" style="background: ${card.gradient};">
          <span class="stat-card-icon">${card.icon}</span>
          <p class="stat-card-value">${escapeHtml(card.value)}</p>
          <p class="stat-card-label">${escapeHtml(card.label)}</p>
        </article>
      `,
    )
    .join("");

const renderKeyInsights = (report) => {
  const insights = [
    `<strong>${escapeHtml(
      report.activePetitions,
    )}</strong> active petitions driving engagement.`,
    `<strong>${escapeHtml(
      report.totalVotes,
    )}</strong> votes cast across polls this month.`,
    `<strong>${escapeHtml(
      report.totalSignatures,
    )}</strong> signatures collected across petitions.`,
    `<strong>${escapeHtml(
      report.pendingPetitions,
    )}</strong> petitions awaiting review.`,
  ];

  return insights.map((item) => `<li>${item}</li>`).join("");
};

const buildChartPayload = (report) => {
  const statusLabels = ["Active", "Under Review", "Pending", "Closed"];
  const statusValues = [
    report.activePetitions,
    report.underReviewPetitions,
    report.pendingPetitions,
    report.closedPetitions,
  ];

  const statusColors = ["#10b981", "#f59e0b", "#38bdf8", "#ef4444"];
  const statusBorder = ["#059669", "#d97706", "#0284c7", "#dc2626"];

  return {
    barData: {
      labels: statusLabels,
      datasets: [
        {
          label: "Petitions",
          data: statusValues,
          backgroundColor: statusColors,
          borderColor: statusBorder,
          borderWidth: 1,
          borderRadius: 10,
          maxBarThickness: 48,
        },
      ],
    },
    lineData: {
      labels: ["Petitions", "Signatures", "Polls", "Votes"],
      datasets: [
        {
          label: "Engagement Mix",
          data: [
            report.totalPetitions,
            report.totalSignatures,
            report.totalPolls,
            report.totalVotes,
          ],
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.18)",
          pointBackgroundColor: "#4f46e5",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          tension: 0.35,
          fill: true,
        },
      ],
    },
    doughnutData: {
      labels: statusLabels,
      datasets: [
        {
          label: "Status Share",
          data: statusValues,
          backgroundColor: statusColors,
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      base: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#475569",
              font: { size: 12, weight: "500" },
              padding: 16,
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            backgroundColor: "#0f172a",
            titleColor: "#ffffff",
            bodyColor: "#e2e8f0",
            padding: 10,
            cornerRadius: 10,
          },
        },
      },
      bar: {
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#64748b", font: { size: 11 } },
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(148, 163, 184, 0.2)" },
            ticks: { color: "#64748b", font: { size: 11 }, precision: 0 },
          },
        },
      },
      line: {
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#64748b", font: { size: 11 } },
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(148, 163, 184, 0.2)" },
            ticks: { color: "#64748b", font: { size: 11 }, precision: 0 },
          },
        },
      },
      doughnut: {
        cutout: "60%",
      },
    },
  };
};

const generateReportHTML = async (rawData) => {
  const report = getNormalizedReport(rawData);
  const template = await fs.readFile(TEMPLATE_PATH, "utf8");
  const generatedDate = new Date(report.generatedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return template
    .replaceAll("{{MONTH}}", escapeHtml(report.month))
    .replaceAll("{{GENERATED_DATE}}", escapeHtml(generatedDate))
    .replace("{{PETITION_CARDS}}", renderStatCards(getPetitionCards(report)))
    .replace("{{POLL_CARDS}}", renderStatCards(getPollCards(report)))
    .replace("{{KEY_INSIGHTS}}", renderKeyInsights(report));
};

const renderCharts = async (page, chartPayload) => {
  await page.addScriptTag({ path: CHART_SCRIPT_PATH });

  await page.evaluate((payload) => {
    window.__chartsReady = false;
    window.__chartsError = null;

    try {
      const ChartRef = window.Chart;
      if (!ChartRef) {
        throw new Error("Chart.js failed to load in Puppeteer page");
      }

      ChartRef.defaults.animation = false;
      ChartRef.defaults.responsive = true;
      ChartRef.defaults.maintainAspectRatio = false;
      ChartRef.defaults.font.family =
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ChartRef.defaults.color = "#475569";

      const mergeOptions = (extraOptions) => {
        const base = payload.options.base;
        return {
          ...base,
          ...extraOptions,
          plugins: {
            ...base.plugins,
            ...(extraOptions.plugins || {}),
          },
          scales: {
            ...(base.scales || {}),
            ...(extraOptions.scales || {}),
          },
        };
      };

      const statusBarCanvas = document.getElementById("statusBarChart");
      const engagementLineCanvas = document.getElementById("engagementLineChart");
      const statusShareCanvas = document.getElementById("statusShareChart");

      new ChartRef(statusBarCanvas, {
        type: "bar",
        data: payload.barData,
        options: mergeOptions(payload.options.bar),
      });

      new ChartRef(engagementLineCanvas, {
        type: "line",
        data: payload.lineData,
        options: mergeOptions(payload.options.line),
      });

      new ChartRef(statusShareCanvas, {
        type: "doughnut",
        data: payload.doughnutData,
        options: mergeOptions(payload.options.doughnut),
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.__chartsReady = true;
        });
      });
    } catch (error) {
      window.__chartsError = error.message;
      window.__chartsReady = true;
    }
  }, chartPayload);
};

const waitForChartsToRender = async (page) => {
  await page.waitForFunction(
    () => {
      return window.__chartsReady === true || !!window.__chartsError;
    },
    { timeout: CHART_RENDER_TIMEOUT_MS },
  );

  const chartError = await page.evaluate(() => window.__chartsError);
  if (chartError) {
    throw new Error(chartError);
  }

  await page.waitForFunction(
    () => {
      const canvases = Array.from(document.querySelectorAll("canvas"));

      if (canvases.length === 0) {
        return false;
      }

      return canvases.every((canvas) => {
        if (!canvas.width || !canvas.height) {
          return false;
        }

        try {
          return canvas.toDataURL("image/png").length > 2000;
        } catch (error) {
          return false;
        }
      });
    },
    { timeout: CHART_RENDER_TIMEOUT_MS },
  );
};

exports.generatePDF = async (data, res) => {
  const report = getNormalizedReport(data);
  const html = await generateReportHTML(report);
  const chartPayload = buildChartPayload(report);
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 2200, deviceScaleFactor: 2 });
    await page.emulateMediaType("screen");
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    await renderCharts(page, chartPayload);
    await waitForChartsToRender(page);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "18mm",
        bottom: "18mm",
        left: "14mm",
        right: "14mm",
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="monthly-report.pdf"',
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.send(pdfBuffer);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

exports.generateReportHTML = generateReportHTML;
