import { MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

const ThreeDotsButton = () => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "h-8 w-8 p-0 min-w-8",
        "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      )}
    >
      <span className="sr-only">Open menu</span>
      <MoreHorizontal className="h-6 w-6" />
    </Button>
  );
};

export default ThreeDotsButton;
