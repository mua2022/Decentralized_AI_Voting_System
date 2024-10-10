import React from "react";
import CreateProposal from "./components/CreateProposal";
import ProposalList from "./components/ProposalList";

function App() {
  return (
    <div className="App">
      <h1>Governance DApp</h1>
      <CreateProposal />
      <ProposalList />
    </div>
  );
}

export default App;
