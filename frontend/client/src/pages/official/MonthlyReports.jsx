import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function MonthlyReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/reports/monthly");
      setReport(res.data.report || res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load monthly report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleExportCSV = async () => {
    try {
      const res = await api.get("/api/reports/export/csv", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "monthly-report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("CSV export failed");
    }
  };

  const handleExportPDF = async () => {
    try {
      const res = await api.get("/api/reports/export/pdf", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "monthly-report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("PDF export failed");
    }
  };

  if (loading) return <p>Loading monthly report...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Monthly Civic Engagement Report</h2>
        <p>Overview of petitions and official activities</p>
      </div>

      <div className="report-cards">
        <div className="report-card">
          <h4>Total Petitions</h4>
          <p>{report?.totalPetitions || 0}</p>
        </div>

        <div className="report-card">
          <h4>Resolved Petitions</h4>
          <p>{report?.resolvedPetitions || 0}</p>
        </div>

        <div className="report-card">
          <h4>Pending Petitions</h4>
          <p>{report?.pendingPetitions || 0}</p>
        </div>

        <div className="report-card">
          <h4>Total Responses</h4>
          <p>{report?.totalResponses || 0}</p>
        </div>
      </div>

      <div className="export-buttons">
        <button className="btn-primary" onClick={handleExportCSV}>
          Export CSV
        </button>
        <button className="btn-primary" onClick={handleExportPDF}>
          Export PDF
        </button>
      </div>
    </div>
  );
}