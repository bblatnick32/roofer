import { Button } from "@/components/ui/button";

const ProposalReviewStatusButtons = () => {
  return (
    <>
      <Button>Mark as Accepted</Button>
      <Button variant={"destructive"}>Mark as Rejected</Button>
    </>
  );
};

export default ProposalReviewStatusButtons;
