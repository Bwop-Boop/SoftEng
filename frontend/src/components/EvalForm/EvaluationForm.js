import React, { useState, useEffect } from "react";
import axios from "axios";
import "./evaluationform.css";
import Modal from "react-modal";
import { FaBroom, FaClipboardList, FaSmile, FaUserTie, FaCheckCircle, FaBolt, FaStar, FaPaperPlane } from 'react-icons/fa';

Modal.setAppElement('#root'); // Set the app element for accessibility

const EvaluationForm = () => {
  const [stores, setStores] = useState([]);
  const [evaluatedStores, setEvaluatedStores] = useState(new Set());
  const [selectedStore, setSelectedStore] = useState("");
  const [ratings, setRatings] = useState({
    cl1: "", cl2: "", cl3: "", cl4: "", cl5: "", cl6: "", cl7: "",
    cn1: "", cn2: "", cn3: "", cn4: "", cn5: "", cn6: "", cn7: "", cn8: "", cn9: "", cn10: "", cn11: "",
    ce1: "", ce2: "", ce3: "", ce4: "", ce5: "", ce6: "",
    pg1: "",
    ac1: "", ac2: "", ac3: "",
    ss1: "", ss2: "", ss3: "",
    pq1: "", pq2: "",
    remarks: ""
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentQuestions, setCurrentQuestions] = useState([]);

  const criteriaLabels = {
    cl: "Cleanliness",
    cn: "Condition",
    ce: "Customer Engagement",
    pg: "Personnel Grooming",
    ac: "Accuracy",
    ss: "Speed of Service",
    pq: "Product Quality"
  };

  const criteriaIcons = {
    cl: <FaBroom />,
    cn: <FaClipboardList />,
    ce: <FaSmile />,
    pg: <FaUserTie />,
    ac: <FaCheckCircle />,
    ss: <FaBolt />,
    pq: <FaStar />
  };

  const questions = {
    cl: [
      { id: "cl1", text: "No wet/dry trash laying around, trash bins are clean and covered?" },
      { id: "cl2", text: "No inventory from deliveries laying around?" },
      { id: "cl3", text: "No leakages around nor underneath the cart?" },
      { id: "cl4", text: "Display chiller for bites is clean, tidy, sorted, and organized; greaseproof paper on tray?" },
      { id: "cl5", text: "Bites in display are in original clear plastic packaging, only one type of Pickup Bite is on display and placed in front of the chiller?" },
      { id: "cl6", text: "Cart interior (walls, ceiling, floor) is clean and free of dirt and spillages." },
      { id: "cl7", text: "No sign of pests, such as cockroaches, flies, bees, etc." }
    ],
    cn: [
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
    ],
    ce: [
      { id: "ce1", text: "I was acknowledged with a smile and friendly greetings, and staff used positive body language." },
      { id: "ce2", text: "The staff approached me with kindness and patience." },
      { id: "ce3", text: "The staff did not engage in unnecessary activities that distracted them from attending to me (e.g., using cellphone, lingering, etc.)." },
      { id: "ce4", text: "Staff maintained good synergy and flow with team members at the bar." },
      { id: "ce5", text: "The order was repeated back to me to confirm accuracy." },
      { id: "ce6", text: "The staff mentioned the product name of items being served." }
    ],
    pg: [
      { id: "pg1", text: "All employees were well-groomed and wearing proper uniforms." }
    ],
    ac: [
      { id: "ac1", text: "The items I ordered were available, and I was informed if any items were missing." },
      { id: "ac2", text: "I was given the correct amount with the receipt." },
      { id: "ac3", text: "I was served the complete and correct order, including special instructions." }
    ],
    ss: [
      { id: "ss1", text: "The time before my order was taken was reasonable." },
      { id: "ss2", text: "The cashiering time was reasonable." },
      { id: "ss3", text: "The time before my product/drink was served was reasonable based on the order type." }
    ],
    pq: [
      { id: "pq1", text: "The product/drink served tasted good." },
      { id: "pq2", text: "The product temperatures were acceptable (Hot products/drinks were hot, Cold products/drinks were cold)." }
    ]
  };

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/stores/")
      .then(response => setStores(response.data))
      .catch(error => console.error("Error fetching stores:", error));

    axios.get("http://127.0.0.1:8000/api/evaluations/")
      .then(response => {
        const evaluatedStoreIds = new Set(response.data.map(evaluation => evaluation.store));
        setEvaluatedStores(evaluatedStoreIds);
      })
      .catch(error => console.error("Error fetching evaluations:", error));
  }, []);

  const handleRatingChange = (e) => {
    setRatings({ ...ratings, [e.target.name]: e.target.value });

    // Automatically close the modal if all questions are rated
    const allRated = currentQuestions.every(question => ratings[question.id] !== "");
    if (allRated) {
      closeModal();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (evaluatedStores.has(selectedStore)) {
      alert("❌ This store has already been evaluated.");
      return;
    }

    const selectedStoreData = stores.find(store => String(store.id) === String(selectedStore));

    const storeName = selectedStoreData?.name || "";
    const storeAddress = selectedStoreData?.address || "";

    if (!storeName || !storeAddress) {
      alert("❌ Store name or address is missing.");
      return;
    }

    // Set the evaluation date to the current date (this will be sent to the backend)
    const evaluationDate = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD

    const evaluationData = {
      store: selectedStore,
      evaluation_date: evaluationDate,
      ...ratings
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/evaluations/", evaluationData);
      if (response.status === 201) {
        alert("✅ Evaluation submitted successfully!");
        setEvaluatedStores(prev => new Set(prev).add(selectedStore));
        setSelectedStore("");
        setRatings({
          cl1: "", cl2: "", cl3: "", cl4: "", cl5: "", cl6: "", cl7: "",
          cn1: "", cn2: "", cn3: "", cn4: "", cn5: "", cn6: "", cn7: "", cn8: "", cn9: "", cn10: "", cn11: "",
          ce1: "", ce2: "", ce3: "", ce4: "", ce5: "", ce6: "",
          pg1: "",
          ac1: "", ac2: "", ac3: "",
          ss1: "", ss2: "", ss3: "",
          pq1: "", pq2: "",
          remarks: ""
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert(`❌ Error: ${JSON.stringify(error.response.data)}`);
      } else {
        alert("❌ Error submitting evaluation. Please try again.");
      }
    }
  };

  const openModal = (category) => {
    setCurrentCategory(criteriaLabels[category]);
    setCurrentQuestions(questions[category]);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const isSubmitDisabled = () => {
    const allRatings = Object.values(ratings).filter((value, index) => {
      const field = Object.keys(ratings)[index];
      return field !== "remarks" && value === "";
    });
    return selectedStore === "" || allRatings.length > 0;
  };

  return (
    <div className="background-panel-eval">
      <div className="form-container-eval">
        <h2>Submit Store Evaluation</h2>
        <form onSubmit={handleSubmit} className="evaluation-form-eval">
          <label>Store:</label>
          <select value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)} required>
            <option value="">Select a store</option>
            {stores.map(store => (
              <option key={store.id} value={store.id} disabled={evaluatedStores.has(store.id)}>
                {store.name} {evaluatedStores.has(store.id) ? "(Already Evaluated)" : ""}
              </option>
            ))}
          </select>

          {/* Rating Criteria */}
          <div className="rating-criteria-eval">
            <div>1 <br />Strongly Disagree</div>
            <div>2 <br />Disagree</div>
            <div>3 <br />Neutral</div>
            <div>4 <br />Agree</div>
            <div>5 <br />Strongly Agree</div>
          </div>

          {/* Generate category buttons to open modals */}
          {Object.keys(criteriaLabels).map((category) => (
            <button type="button" key={category} onClick={() => openModal(category)} className="category-button-eval">
              <span className="category-icon-eval">{criteriaIcons[category]}</span>
              {criteriaLabels[category]}
            </button>
          ))}

          {/* Add a textarea for optional remarks */}
          <div className="remarks-container-eval">
            <label htmlFor="remarks" className="remarks-label-eval">(Optional) Remarks:</label>
            <textarea
              id="remarks"
              name="remarks"
              value={ratings.remarks}
              onChange={handleRatingChange}
              rows="4"
              placeholder="How can we improve our products and services?"
              className="remarks-textarea-eval"
            ></textarea>
          </div>

          <button type="submit" className="submit-button-eval" disabled={isSubmitDisabled()}>
            <FaPaperPlane className="submit-icon-eval" />
            Submit
          </button>
        </form>

        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Questionnaire Modal" className="ReactModal__Content" overlayClassName="ReactModal__Overlay">
          <div className="modal-content-eval">
            <div className="modal-header-eval">
              <span className="modal-icon-eval">{criteriaIcons[currentCategory.toLowerCase()]}</span>
              <h2>{currentCategory}</h2>
              <span className="modal-items-count-eval">{currentQuestions.length} Items</span>
            </div>
            <div className="modal-body-eval">
              <table className="modal-table-eval">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {currentQuestions.map((question) => (
                    <tr key={question.id} className="modal-question-eval">
                      <td><label>{question.text}</label></td>
                      <td>
                        <select name={question.id} value={ratings[question.id]} onChange={handleRatingChange} required>
                          <option value="">Select a rating</option>
                          {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={closeModal} className="modal-close-button-eval">Close</button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default EvaluationForm;