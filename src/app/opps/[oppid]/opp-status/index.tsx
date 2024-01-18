import { Opp, OppStages } from "@/lib/db";
import LeadCheckListItems from "./lead-check-list-items";

const OppStatusToolbar = ({ opp }: { opp: Opp }) => {
  const stage = opp.stage;

  return (
    <>
      {stage === OppStages.LEAD && <LeadCheckListItems opp={opp} />}
      {stage === OppStages.INSPECTION && <></>}
      {stage === OppStages.PROPOSAL && <></>}
    </>
  );
};

export default OppStatusToolbar;
