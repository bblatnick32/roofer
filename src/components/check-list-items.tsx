import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";

type CheckListItem = {
  label: string;
  value: string;
  completed: boolean;
};

export function CheckListItems({
  items,
  onClick,
}: {
  items: CheckListItem[];
  onClick: (e: React.MouseEvent, value: string) => void;
}) {
  return (
    <div className="flex flex-col space-y-2">
      {items.map((item) => (
        <div className="flex items-center space-x-2" key={item.value}>
          <Checkbox
            id={item.value}
            checked={item.completed}
            onClick={(e) => onClick(e, item.value)}
          />
          <label
            htmlFor={item.value}
            className={cn(
              "cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              item.completed && "line-through"
            )}
            onClick={(e) => onClick(e, item.value)}
          >
            {item.label}
          </label>
        </div>
      ))}
    </div>
  );
}
