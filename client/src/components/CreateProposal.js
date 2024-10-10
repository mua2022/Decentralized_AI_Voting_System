import React, { useState } from "react";
import { submitProposal } from "../services/web3Service";

function CreateProposal() {
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (description) {
      try {
        await submitProposal(description);
        alert("Proposal submitted successfully!");
        setDescription("");
      } catch (err) {
        console.error(err);
        alert("Error submitting proposal");
      }
    }
  };

  return (
    <div>
      <h2>Create a New Proposal</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Proposal description"
          required
        />
        <button type="submit">Submit Proposal</button>
      </form>
    </div>
  );
}

export default CreateProposal;
