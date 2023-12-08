import Stage from "./stage";

const StatusPipeline = <Status extends string>({
  statuses,
  currentStatus,
  onClick,
}: {
  statuses: Status[];
  currentStatus: Status;
  onClick: (status: Status) => void;
}) => {
  let found = false;

  return (
    <div aria-label="Progress">
      <ul role="list" className="rounded-md flex items-start overflow-hidden">
        {statuses.map((status, statusIdx) => {
          if (status === currentStatus) found = true;
          return (
            <li key={status} className="ml-0 pl-1 relative flex-1 mr-1">
              {found === false ? (
                <Stage
                  className="bg-green-600 hover:bg-green-500 before:bg-green-600 after:border-l-green-600 hover:after:border-l-green-500 hover:before:bg-green-500"
                  isLast={statusIdx === statuses.length - 1}
                  isFirst={statusIdx === 0}
                  onClick={() => onClick(status)}
                >
                  {status}
                </Stage>
              ) : status === currentStatus ? (
                <Stage
                  className="before:bg-primary after:border-l-primary hover:bg-primary"
                  isLast={statusIdx === statuses.length - 1}
                  isFirst={statusIdx === 0}
                  onClick={() => onClick(status)}
                >
                  {status}
                </Stage>
              ) : (
                <Stage
                  className="before:bg-secondary after:border-l-secondary hover:after:border-l-gray-300 hover:before:bg-gray-300"
                  variant="secondary"
                  isLast={statusIdx === statuses.length - 1}
                  isFirst={statusIdx === 0}
                  onClick={() => onClick(status)}
                >
                  {status}
                </Stage>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StatusPipeline;
