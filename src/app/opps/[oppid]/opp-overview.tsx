import { Opp } from "@/lib/db";
import { Label } from "@/components/ui/label";

const OppOverview = ({ opp }: { opp: Opp }) => {
  return (
    <div className="grid grid-cols-4 gap-8">
      <div className="flex flex-col gap-2">
        <Label>Name</Label>
        <span className="text-sm">{opp.name}</span>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Company</Label>
        <span className="text-sm">{opp.name}</span>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Property</Label>
        <span className="text-sm">{opp.name}</span>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Contact</Label>
        <span className="text-sm">{opp.name}</span>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Description</Label>
        <span className="text-sm">{opp.name}</span>
      </div>
    </div>
  );
};

export default OppOverview;
