"use client";
import { trpc } from "@/lib/trpc/client";
import { toast } from "@/components/ui/use-toast";
import { Opp, UpdateOppParams, OppStages } from "@/lib/db";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StagePipeline from "@/components/stage-pipeline";

const stages = Object.values(OppStages);
type Stage = (typeof stages)[number];

const OppStagePipeline = ({ opp }: { opp: Opp }) => {
  const [currentStage, setCurrentStage] = useState(opp.stage as Stage);
  const router = useRouter();

  const onSuccess = async (action: "update" | "convert") => {
    router.refresh();
    toast({
      title: "Success",
      description:
        action === "update" ? "Opportunity updated!" : "Opportunity converted!",
      variant: "default",
    });
  };

  const { mutate: updateOpp } = trpc.opps.updateOpp.useMutation({
    onSuccess: async () => onSuccess("update"),
  });

  const handleOnClick = (stage: Stage) => {
    setCurrentStage(stage);
    updateOpp({ ...(opp as UpdateOppParams), stage });
  };

  return (
    <>
      <StagePipeline<Stage>
        stages={stages}
        currentStage={currentStage}
        onClick={handleOnClick}
      />
    </>
  );
};

export default OppStagePipeline;
