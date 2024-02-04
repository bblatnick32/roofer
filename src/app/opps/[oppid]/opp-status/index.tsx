import { Opp, OppStages } from "@/lib/db";
import LeadCheckListItems from "./lead-check-list-items";
import InspectionCheckListItems from "./inspection-check-list-items";

const OppStageChecklist = ({ opp }: { opp: Opp }) => {
  const stage = opp.stage;

  return (
    <>
      {stage === OppStages.LEAD && <LeadCheckListItems opp={opp} />}
      {stage === OppStages.INSPECTION && <InspectionCheckListItems opp={opp} />}
      {stage === OppStages.PROPOSAL && <></>}
    </>
  );
};

export default OppStageChecklist;
