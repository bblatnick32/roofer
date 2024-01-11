import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";

export type CheckListItem<ItemType> = {
  label: string;
  value: ItemType;
  completed: boolean;
};

export function CheckListItems<ItemType extends string>({
  items,
  onClick,
}: {
  items: CheckListItem<ItemType>[];
  onClick: (e: React.MouseEvent, value: ItemType) => void;
}) {
  return (
    <div className="flex flex-col space-y-4">
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
