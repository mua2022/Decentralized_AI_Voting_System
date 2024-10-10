import React, { useEffect, useState } from "react";
import { getProposals } from "../services/web3Service";
import ProposalDetails from "./ProposalDetails";

function ProposalList() {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const fetchProposals = async () => {
      const data = await getProposals();
      setProposals(data);
    };

    fetchProposals();
  }, []);

  return (
    <div>
      <h2>Proposal List</h2>
      {proposals.length === 0 ? (
        <p>No proposals yet.</p>
      ) : (
        proposals.map((proposal, index) => (
          <ProposalDetails key={index} proposal={proposal} />
        ))
      )}
    </div>
  );
}

export default ProposalList;
