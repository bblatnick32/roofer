import Stage from "./stage";
import { cn } from "@/lib/utils";

const StagePipeline = <Stage extends string>({
  stages,
  currentStage,
  onClick,
}: {
  stages: Stage[];
  currentStage: Stage;
  onClick: (stage: Stage) => void;
}) => {
  let found = false;

  return (
    <ul
      role="list"
      className="rounded-md flex items-start overflow-hidden w-full mt-5"
    >
      {stages.map((stage, stageIdx) => {
        if (stage === currentStage) found = true;

        const isLast = stageIdx === stages.length - 1;
        const isFirst = stageIdx === 0;

        return (
          <li
            key={stage}
            className={cn(
              "ml-0 relative flex-1",
              !isFirst && "pl-1",
              !isLast && "pr-1"
            )}
          >
            {found === false ? (
              <Stage
                className="bg-green-600 hover:bg-green-600 before:bg-green-600 after:border-l-green-600 hover:after:border-l-green-600 hover:before:bg-green-600"
                isLast={isLast}
                isFirst={isFirst}
                onClick={() => onClick(stage)}
              >
                {stage}
              </Stage>
            ) : stage === currentStage ? (
              <Stage
                className="before:bg-primary after:border-l-primary hover:bg-primary"
                isLast={isLast}
                isFirst={isFirst}
                onClick={() => onClick(stage)}
              >
                {stage}
              </Stage>
            ) : (
              <Stage
                className="before:bg-secondary after:border-l-secondary hover:after:border-l-secondary hover:before:bg-secondary hover:bg-secondary"
                variant="secondary"
                isLast={isLast}
                isFirst={isFirst}
                onClick={() => onClick(stage)}
              >
                {stage}
              </Stage>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default StagePipeline;
