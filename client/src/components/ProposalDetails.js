import React, { useState } from "react";
import { voteOnProposal } from "../services/web3Service";

function ProposalDetails({ proposal }) {
  const [voted, setVoted] = useState(false);

  const handleVote = async (vote) => {
    try {
      await voteOnProposal(proposal.id, vote);
      alert(`Voted ${vote ? "Yes" : "No"} successfully!`);
      setVoted(true);
    } catch (err) {
      console.error(err);
      alert("Error voting");
    }
  };

  return (
    <div>
      <h3>{proposal.description}</h3>
      <p>Yes: {proposal.voteCountYes}, No: {proposal.voteCountNo}</p>
      {voted ? (
        <p>You have voted</p>
      ) : (
        <div>
          <button onClick={() => handleVote(true)}>Vote Yes</button>
          <button onClick={() => handleVote(false)}>Vote No</button>
        </div>
      )}
    </div>
  );
}

export default ProposalDetails;
