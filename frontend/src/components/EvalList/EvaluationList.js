import React, { useState, useEffect } from "react";
import axios from "axios";
import "./evaluationlist.css";

const EvaluationList = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "performance", direction: "desc" });
  const [filter, setFilter] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [rankFilter, setRankFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const userRole = sessionStorage.getItem("userRole");

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/evaluations/");
      setEvaluations(response.data);
    } catch (error) {
      console.error("Error fetching evaluations:", error);
    }
  };

  const handleDeleteEvaluation = async (evaluationId) => {
    if (!window.confirm("Are you sure you want to delete this evaluation?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/evaluations/${evaluationId}/`);
      fetchEvaluations();
    } catch (error) {
      console.error("Error deleting evaluation:", error);
    }
  };

  const handleEditClick = (evaluation) => {
    setCurrentEvaluation(evaluation);
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    const intValue = parseInt(value, 10);
    if ([1, 2, 3, 4, 5].includes(intValue) || value === "") {
      setCurrentEvaluation((prev) => ({ ...prev, [name]: intValue || "" }));
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/evaluations/${currentEvaluation.id}/`, currentEvaluation);
      setEditModalOpen(false);
      fetchEvaluations();
    } catch (error) {
      console.error("Error updating evaluation:", error);
    }
  };

  const calculatePerformance = (evaluation) => {
    const ratingFields = [
      "cl1", "cl2", "cl3", "cl4", "cl5", "cl6", "cl7",
      "cn1", "cn2", "cn3", "cn4", "cn5", "cn6", "cn7", "cn8", "cn9", "cn10", "cn11",
      "ce1", "ce2", "ce3", "ce4", "ce5", "ce6",
      "pg1", "ac1", "ac2", "ac3",
      "ss1", "ss2", "ss3",
      "pq1", "pq2"
    ];

    const totalScore = ratingFields.reduce((sum, field) => {
      return sum + (evaluation[field] || 0);
    }, 0);

    const totalPossibleScore = ratingFields.length * 5;
    const performancePercentage = ((totalScore / totalPossibleScore) * 100).toFixed(2);

    return performancePercentage;
  };

  const calculateAverageRating = (evaluation) => {
    const ratingFields = [
      "cl1", "cl2", "cl3", "cl4", "cl5", "cl6", "cl7",
      "cn1", "cn2", "cn3", "cn4", "cn5", "cn6", "cn7", "cn8", "cn9", "cn10", "cn11",
      "ce1", "ce2", "ce3", "ce4", "ce5", "ce6",
      "pg1", "ac1", "ac2", "ac3",
      "ss1", "ss2", "ss3",
      "pq1", "pq2"
    ];

    const totalRating = ratingFields.reduce((sum, field) => {
      return sum + (evaluation[field] || 0);
    }, 0);

    const averageRating = (totalRating / ratingFields.length).toFixed(2);

    return averageRating;
  };

  const getPerformanceDescription = (percentage) => {
    if (percentage >= 95) return "Outstanding";
    if (percentage >= 90) return "Excellent";
    if (percentage >= 85) return "Great";
    if (percentage >= 80) return "Very Good";
    if (percentage >= 75) return "Good";
    if (percentage >= 70) return "Above Average";
    if (percentage >= 65) return "Average";
    if (percentage >= 60) return "Fair";
    if (percentage >= 55) return "Needs Improvement";
    if (percentage >= 50) return "Below Average";
    return "Poor";
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const getSortedEvaluations = () => {
    return [...evaluations].sort((a, b) => {
      let aValue, bValue;
      if (sortConfig.key === "store_name") {
        aValue = a.store_details?.name || "";
        bValue = b.store_details?.name || "";
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (sortConfig.key === "evaluation_date") {
        aValue = new Date(a.evaluation_date);
        bValue = new Date(b.evaluation_date);
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      } else {
        aValue = parseFloat(calculatePerformance(a));
        bValue = parseFloat(calculatePerformance(b));
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
    });
  };

  const getRankedEvaluations = () => {
    const sortedEvals = getSortedEvaluations();
    return sortedEvals.map((evaluation, index) => ({
      ...evaluation,
      rank: index + 1,
    }));
  };

  const filteredEvaluations = getRankedEvaluations().filter((evaluation) => {
    const performance = calculatePerformance(evaluation);
    const description = getPerformanceDescription(performance);
    return (filter === "" || description === filter) && (rankFilter === "" || evaluation.rank === parseInt(rankFilter, 10));
  });

  const uniqueRanks = getRankedEvaluations().map(evaluation => evaluation.rank);

  const searchResults = filteredEvaluations.filter((evaluation) => {
    return evaluation.store_details?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredByCategory = searchResults.filter((evaluation) => {
    if (categoryFilter === "") return true;
    return Object.keys(evaluation).some(key => key.startsWith(categoryFilter));
  });

  return (
    <div className="background-panel-list">
      <div className="store-management-list">
        <h2>Evaluation Summaries</h2>

        <div className="filters-container">
          <div className="filter-group">
            <label>Filter by Performance:</label>
            <select onChange={(e) => setFilter(e.target.value)} value={filter}>
              <option value="">All</option>
              <option value="Outstanding">Outstanding</option>
              <option value="Excellent">Excellent</option>
              <option value="Great">Great</option>
              <option value="Very Good">Very Good</option>
              <option value="Good">Good</option>
              <option value="Above Average">Above Average</option>
              <option value="Average">Average</option>
              <option value="Fair">Fair</option>
              <option value="Needs Improvement">Needs Improvement</option>
              <option value="Below Average">Below Average</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Filter by Rank:</label>
            <select onChange={(e) => setRankFilter(e.target.value)} value={rankFilter}>
              <option value="">All</option>
              {uniqueRanks.map(rank => (
                <option key={rank} value={rank}>{rank}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Search Store:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by store name"
            />
          </div>
        </div>

        {/* Summary Table */}
        <table className="evaluation-table-list">
          <thead>
            <tr>
              <th onClick={() => handleSort("store_name")} className={`sortable ${sortConfig.key === "store_name" ? sortConfig.direction : ""}`}>Store Name</th>
              <th onClick={() => handleSort("performance")} className={`sortable ${sortConfig.key === "performance" ? sortConfig.direction : ""}`}>Total Performance (%)</th>
              <th onClick={() => handleSort("average_rating")} className={`sortable ${sortConfig.key === "average_rating" ? sortConfig.direction : ""}`}>Average Rating</th>
              <th onClick={() => handleSort("evaluation_date")} className={`sortable ${sortConfig.key === "evaluation_date" ? sortConfig.direction : ""}`}>Evaluation Date</th>
              <th>Performance Description</th>
              {userRole === "staff" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {searchResults.length > 0 ? (
              searchResults.map((evaluation) => (
                <tr key={evaluation.id}>
                  <td>{evaluation.store_details ? evaluation.store_details.name : "No Store Name"}</td>
                  <td>{calculatePerformance(evaluation)}%</td>
                  <td>{calculateAverageRating(evaluation)}</td>
                  <td>{evaluation.evaluation_date || "N/A"}</td>
                  <td>{getPerformanceDescription(calculatePerformance(evaluation))}</td>
                  {userRole === "staff" && (
                    <td>
                      <button className="btn-edit" onClick={() => handleEditClick(evaluation)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteEvaluation(evaluation.id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={userRole === "staff" ? "6" : "5"}>No stores found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Detailed Scores */}
        <h2>Detailed Scores</h2>
        <div className="filters-container">
          <div className="filter-group">
            <label>Filter by Category:</label>
            <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter}>
              <option value="">All</option>
              <option value="cl">Cleanliness</option>
              <option value="cn">Condition</option>
              <option value="ce">Customer Engagement</option>
              <option value="pg">Personnel Grooming</option>
              <option value="ac">Accuracy</option>
              <option value="ss">Speed of Service</option>
              <option value="pq">Product Quality</option>
            </select>
          </div>
        </div>
        <div className="evaluation-details">
          {filteredByCategory.map((evaluation) => (
            <div key={evaluation.id} className="evaluation-detail">
              <h3>Store Name:</h3> <h2> {evaluation.store_details ? evaluation.store_details.name : "No Store Name"}</h2>
              {categoryFilter === "" || categoryFilter === "cl" ? (
                <div className="category">
                  <h4>Cleanliness</h4>
                  <ul>
                    <li>No wet/dry trash laying around, trash bins are clean and covered: <strong>{evaluation.cl1}</strong></li>
                    <li>No inventory from deliveries laying around: <strong>{evaluation.cl2}</strong></li>
                    <li>No leakages around nor underneath the cart: <strong>{evaluation.cl3}</strong></li>
                    <li>Display chiller for bites is clean, tidy, sorted, and organized; greaseproof paper on tray: <strong>{evaluation.cl4}</strong></li>
                    <li>Bites in display are in original clear plastic packaging, only one type of Pickup Bite is on display and placed in front of the chiller: <strong>{evaluation.cl5}</strong></li>
                    <li>Cart interior (walls, ceiling, floor) is clean and free of dirt and spillages: <strong>{evaluation.cl6}</strong></li>
                    <li>No sign of pests, such as cockroaches, flies, bees, etc.: <strong>{evaluation.cl7}</strong></li>
                  </ul>
                </div>) : null}
              {categoryFilter === "" || categoryFilter === "cn" ? (
                <div className="category">
                  <h4>Condition</h4>
                  <ul>
                    <li>All signages are unobstructed and working properly: <strong>{evaluation.cn1}</strong></li>
                    <li>The cart’s paint is vibrant, free of peels, chips, and stains: <strong>{evaluation.cn2}</strong></li>
                    <li>The handheld menu is clear, legible, and free of dents, fades, or tears: <strong>{evaluation.cn3}</strong></li>
                    <li>All TV screens are working properly, without cracks or screen glitches: <strong>{evaluation.cn4}</strong></li>
                    <li>The giant QR code standee is clear, legible, and free of dents, fades, or tears: <strong>{evaluation.cn5}</strong></li>
                    <li>The 'Pick Up Coffee App' countertop display is clear, free of dents, and displayed properly at the cashier counter: <strong>{evaluation.cn6}</strong></li>
                    <li>All store exterior lights are functioning and well-lit: <strong>{evaluation.cn7}</strong></li>
                    <li>All store interior lights are functioning and well-lit: <strong>{evaluation.cn8}</strong></li>
                    <li>The easel at the storefront is positioned properly, clean, and undamaged: <strong>{evaluation.cn9}</strong></li>
                    <li>The cashier and dispatch counters are straight, with varnish/finishing intact and no sharp edges or corners: <strong>{evaluation.cn10}</strong></li>
                    <li>The cart’s canopies are in good working condition, with intact and correctly positioned support chains that keep rain out: <strong>{evaluation.cn11}</strong></li>
                  </ul>
                </div>) : null}
              {categoryFilter === "" || categoryFilter === "ce" ? (
                <div className="category">
                  <h4>Customer Engagement</h4>
                  <ul>
                    <li>I was acknowledged with a smile and friendly greetings, and staff used positive body language: <strong>{evaluation.ce1}</strong></li>
                    <li>The staff approached me with kindness and patience: <strong>{evaluation.ce2}</strong></li>
                    <li>The staff did not engage in unnecessary activities that distracted them from attending to me (e.g., using cellphone, lingering, etc.): <strong>{evaluation.ce3}</strong></li>
                    <li>Staff maintained good synergy and flow with team members at the bar: <strong>{evaluation.ce4}</strong></li>
                    <li>The order was repeated back to me to confirm accuracy: <strong>{evaluation.ce5}</strong></li>
                    <li>The staff mentioned the product name of items being served: <strong>{evaluation.ce6}</strong></li>
                  </ul>
                </div>) : null}
              {categoryFilter === "" || categoryFilter === "pg" ? (
                <div className="category">
                  <h4>Personnel Grooming</h4>
                  <ul>
                    <li>All employees were well-groomed and wearing proper uniforms: <strong>{evaluation.pg1}</strong></li>
                  </ul>
                </div>) : null}
              {categoryFilter === "" || categoryFilter === "ac" ? (
                <div className="category">
                  <h4>Accuracy</h4>
                  <ul>
                    <li>The items I ordered were available, and I was informed if any items were missing: <strong>{evaluation.ac1}</strong></li>
                    <li>I was given the correct amount with the receipt: <strong>{evaluation.ac2}</strong></li>
                    <li>I was served the complete and correct order, including special instructions: <strong>{evaluation.ac3}</strong></li>
                  </ul>
                </div>) : null}
              {categoryFilter === "" || categoryFilter === "ss" ? (
                <div className="category">
                  <h4>Speed of Service</h4>
                  <ul>
                    <li>The time before my order was taken was reasonable: <strong>{evaluation.ss1}</strong></li>
                    <li>The cashiering time was reasonable: <strong>{evaluation.ss2}</strong></li>
                    <li>The time before my product/drink was served was reasonable based on the order type: <strong>{evaluation.ss3}</strong></li>
                  </ul>
                </div>) : null}
              {categoryFilter === "" || categoryFilter === "pq" ? (
                <div className="category">
                  <h4>Product Quality</h4>
                  <ul>
                    <li>The product/drink served tasted good: <strong>{evaluation.pq1}</strong></li>
                    <li>The product temperatures were acceptable (Hot products/drinks were hot, Cold products/drinks were cold): <strong>{evaluation.pq2}</strong></li>
                  </ul>
                </div>) : null}
            </div>
          ))}
        </div>
      {editModalOpen && (
  <div className="modal-list">
    <div className="modal-content-list">
      <h3>Edit Evaluation</h3>
      <div className="category">
        <h4>Cleanliness</h4>
        {[
          { id: "cl1", text: "No wet/dry trash laying around, trash bins are clean and covered?" },
          { id: "cl2", text: "No inventory from deliveries laying around?" },
          { id: "cl3", text: "No leakages around nor underneath the cart?" },
          { id: "cl4", text: "Display chiller for bites is clean, tidy, sorted, and organized; greaseproof paper on tray?" },
          { id: "cl5", text: "Bites in display are in original clear plastic packaging, only one type of Pickup Bite is on display and placed in front of the chiller?" },
          { id: "cl6", text: "Cart interior (walls, ceiling, floor) is clean and free of dirt and spillages." },
          { id: "cl7", text: "No sign of pests, such as cockroaches, flies, bees, etc." }
        ].map((field) => (
          <div key={field.id}>
            <label>{field.text}</label>
            <select name={field.id} value={currentEvaluation[field.id]} onChange={handleEditChange}>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="category">
        <h4>Condition</h4>
        {[
          { id: "cn1", text: "All signages are unobstructed and working properly." },
          { id: "cn2", text: "The cart’s paint is vibrant, free of peels, chips, and stains." },
          { id: "cn3", text: "The handheld menu is clear, legible, and free of dents, fades, or tears." },
          { id: "cn4", text: "All TV screens are working properly, without cracks or screen glitches." },
          { id: "cn5", text: "The giant QR code standee is clear, legible, and free of dents, fades, or tears." },
          { id: "cn6", text: "The 'Pick Up Coffee App' countertop display is clear, free of dents, and displayed properly at the cashier counter." },
          { id: "cn7", text: "All store exterior lights are functioning and well-lit." },
          { id: "cn8", text: "All store interior lights are functioning and well-lit." },
          { id: "cn9", text: "The easel at the storefront is positioned properly, clean, and undamaged." },
          { id: "cn10", text: "The cashier and dispatch counters are straight, with varnish/finishing intact and no sharp edges or corners." },
          { id: "cn11", text: "The cart’s canopies are in good working condition, with intact and correctly positioned support chains that keep rain out." }
        ].map((field) => (
          <div key={field.id}>
            <label>{field.text}</label>
            <select name={field.id} value={currentEvaluation[field.id]} onChange={handleEditChange}>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="category">
        <h4>Customer Engagement</h4>
        {[
          { id: "ce1", text: "I was acknowledged with a smile and friendly greetings, and staff used positive body language." },
          { id: "ce2", text: "The staff approached me with kindness and patience." },
          { id: "ce3", text: "The staff did not engage in unnecessary activities that distracted them from attending to me (e.g., using cellphone, lingering, etc.)." },
          { id: "ce4", text: "Staff maintained good synergy and flow with team members at the bar." },
          { id: "ce5", text: "The order was repeated back to me to confirm accuracy." },
          { id: "ce6", text: "The staff mentioned the product name of items being served." }
        ].map((field) => (
          <div key={field.id}>
            <label>{field.text}</label>
            <select name={field.id} value={currentEvaluation[field.id]} onChange={handleEditChange}>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="category">
        <h4>Personnel Grooming</h4>
        {[
          { id: "pg1", text: "All employees were well-groomed and wearing proper uniforms." }
        ].map((field) => (
          <div key={field.id}>
            <label>{field.text}</label>
            <select name={field.id} value={currentEvaluation[field.id]} onChange={handleEditChange}>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="category">
        <h4>Accuracy</h4>
        {[
          { id: "ac1", text: "The items I ordered were available, and I was informed if any items were missing." },
          { id: "ac2", text: "I was given the correct amount with the receipt." },
          { id: "ac3", text: "I was served the complete and correct order, including special instructions." }
        ].map((field) => (
          <div key={field.id}>
            <label>{field.text}</label>
            <select name={field.id} value={currentEvaluation[field.id]} onChange={handleEditChange}>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="category">
        <h4>Speed of Service</h4>
        {[
          { id: "ss1", text: "The time before my order was taken was reasonable." },
          { id: "ss2", text: "The cashiering time was reasonable." },
          { id: "ss3", text: "The time before my product/drink was served was reasonable based on the order type." }
        ].map((field) => (
          <div key={field.id}>
            <label>{field.text}</label>
            <select name={field.id} value={currentEvaluation[field.id]} onChange={handleEditChange}>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="category">
        <h4>Product Quality</h4>
        {[
          { id: "pq1", text: "The product/drink served tasted good." },
          { id: "pq2", text: "The product temperatures were acceptable (Hot products/drinks were hot, Cold products/drinks were cold)." }
        ].map((field) => (
          <div key={field.id}>
            <label>{field.text}</label>
            <select name={field.id} value={currentEvaluation[field.id]} onChange={handleEditChange}>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <button onClick={handleSaveChanges} className="btn-save">Save Changes</button>
      <button onClick={() => setEditModalOpen(false)} className="btn-cancel">Cancel</button>
    </div>
  </div>
)}
   </div>
    </div>
  );
};

export default EvaluationList;