import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./reportdashboard.css"; // Updated import statement for the new CSS file

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const ReportDashboard = () => {
  const [reportData, setReportData] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedStoreData, setSelectedStoreData] = useState(null);

  // Fetch report data from backend
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/stores/reports/")
      .then((response) => setReportData(response.data))
      .catch((error) => console.error("Error fetching reports:", error));
  }, []);

  // Update selected store data when a store is selected
  useEffect(() => {
    if (selectedStore) {
      const storeData = reportData.find((store) => store.store_id === Number(selectedStore));
      setSelectedStoreData(storeData);
    }
  }, [selectedStore, reportData]);

  // Get the evaluations for the selected store
  const getStoreEvaluation = () => {
    return selectedStoreData ? selectedStoreData.evaluations[0] : null;
  };

  // Define categories and their fields
  const categories = {
    "CLEANLINESS (CL)": ["cl1", "cl2", "cl3", "cl4", "cl5", "cl6", "cl7"],
    "CONDITION (CN)": ["cn1", "cn2", "cn3", "cn4", "cn5", "cn6", "cn7", "cn8", "cn9", "cn10", "cn11"],
    "CUSTOMER ENGAGEMENT (CE)": ["ce1", "ce2", "ce3", "ce4", "ce5", "ce6"],
    "PERSONNEL GROOMING (PG)": ["pg1"],
    "ACCURACY (AC)": ["ac1", "ac2", "ac3"],
    "SPEED OF SERVICE (SS)": ["ss1", "ss2", "ss3"],
    "PRODUCT QUALITY (PQ)": ["pq1", "pq2"],
  };

  // Calculate the total and average rating per category
  const calculateCategoryRatings = (fields) => {
    const storeEval = getStoreEvaluation();
    if (!storeEval) return { totalScore: 0, average: 0, missing: 5 };

    const totalScore = fields.reduce((sum, field) => sum + (storeEval[field] || 0), 0);
    const maxPossibleScore = fields.length * 5; // Maximum possible score for the category
    const averageRating = totalScore / fields.length;
    const missingPortion = (maxPossibleScore - totalScore) / fields.length; // Missing portion to make it a total of 5

    return {
      totalScore,
      average: averageRating.toFixed(2),
      missing: missingPortion.toFixed(2),
    };
  };

  // Generate data for bar chart (average rating per category)
  const categoryChartData = selectedStoreData
    ? {
        labels: Object.keys(categories),
        datasets: [
          {
            label: "Average Rating",
            data: Object.values(categories).map((fields) => calculateCategoryRatings(fields).average),
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
              "rgba(75, 75, 192, 0.6)",
            ],
          },
        ],
      }
    : {};

  // Generate data for pie chart (distribution of ratings per category)
  const pieChartData = selectedStoreData
    ? {
        labels: [
          ...Object.keys(categories),
          ...Object.keys(categories).map((category) => `Missing Portion (${category.split(" ")[0]})`),
        ],
        datasets: [
          {
            data: [
              ...Object.values(categories).map((fields) => parseFloat(calculateCategoryRatings(fields).average)),
              ...Object.values(categories).map((fields) => parseFloat(calculateCategoryRatings(fields).missing)),
            ],
            backgroundColor: [
              ...[
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
                "rgba(75, 75, 192, 0.6)",
              ],
              ...Array(7).fill("rgba(169, 169, 169, 0.6)"),
            ],
            hoverOffset: 4,
          },
        ],
      }
    : {};

  // Function to download the PDF report for the selected store
  const downloadReport = async () => {
    if (selectedStore) {
      try {
        console.log(`Downloading report for store ID: ${selectedStore}`);
        const response = await axios.get(`http://127.0.0.1:8000/api/stores/${selectedStore}/report/`, {
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${selectedStoreData.store_name}_report.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading the report:", error);
        console.log(`URL: http://127.0.0.1:8000/api/stores/${selectedStore}/report/`);
        console.log(`Error response:`, error.response);
      }
    }
  };

  return (
    <div className="background-panel-report">
      <div className="report-dashboard-container">
        <h2>Store Evaluation Report</h2>

        {/* Store Selection Dropdown */}
        <label className="report-dashboard-label">Select Store:</label>
        <select className="report-dashboard-select" value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)}>
          <option value="">-- Select a Store --</option>
          {reportData.map((store) => (
            <option key={store.store_id} value={store.store_id}>
              {store.store_name}
            </option>
          ))}
        </select>

        {/* Bar Chart for Average Rating per Category */}
        <h3>Average Rating Per Category (Selected Store)</h3>
        <div className="report-dashboard-chart-container">
          {selectedStoreData ? <Bar data={categoryChartData} /> : <p>Please select a store to view the chart.</p>}
        </div>

        {/* Pie Chart for Distribution of Ratings per Category */}
        <h3>Category Distribution (Selected Store)</h3>
        <div className="report-dashboard-pie-chart-container">
          {selectedStoreData ? <Pie data={pieChartData} /> : <p>Please select a store to view the pie chart.</p>}
        </div>

        {/* Table for Total Average Rating and Missing Portion */}
        <h3>Detailed Evaluation Breakdown</h3>
        <table className="report-dashboard-rating-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Average Rating</th>
              <th>Gray Area (Improvements)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(categories).map(([category, fields]) => {
              const { average, missing } = calculateCategoryRatings(fields);
              return (
                <tr key={category}>
                  <td>{category}</td>
                  <td>{average}</td>
                  <td>{missing}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Display Remarks */}
        <h3>Remarks</h3>
        <div className="report-dashboard-remarks-section">
          {selectedStoreData && selectedStoreData.evaluations.length > 0 ? (
            selectedStoreData.evaluations[0].remarks ? (
              <>
                {console.log("Remarks:", selectedStoreData.evaluations[0].remarks)}
                <p>{selectedStoreData.evaluations[0].remarks}</p>
              </>
            ) : (
              <>
                {console.log("No remarks available")}
                <p>No remarks available</p>
              </>
            )
          ) : (
            <>
              {console.log("Please select a store to view remarks.")}
              <p>Please select a store to view remarks.</p>
            </>
          )}
        </div>

        {/* Download Report Button */}
        <button className="report-dashboard-download-button" onClick={downloadReport} disabled={!selectedStore}>
          Download Report
        </button>
      </div>
    </div>
  );
};

export default ReportDashboard;