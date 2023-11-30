import RepairTemplateList from "@/components/repairTemplates/RepairTemplateList";
import { getRepairTemplates } from "@/lib/api/repairTemplates/queries";
import { checkAuth } from "@/lib/auth/utils";
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs";
import NewRepairTemplateModal from "@/components/repairTemplates/RepairTemplateModal";
import NewIssueTemplateModal from "@/components/issueTemplates/IssueTemplateModal";
import IssueTemplateList from "@/components/issueTemplates/IssueTemplateList";
import { getIssueTemplates } from "@/lib/api/issueTemplates/queries";

const Page = async () => {
  await checkAuth("templates");

  const { repairTemplates } = await getRepairTemplates();
  const { issueTemplates } = await getIssueTemplates();

  return (
    <div className="w-full min-h-screen pt-8 px-14">
      <h1 className="text-3xl font-bold mb-4">Templates</h1>
      <Tabs className="w-full" defaultValue="issue">
        <TabsList className="flex gap-4 border-b pb-2">
          <TabsTrigger value="issue">Issue Templates</TabsTrigger>
          <TabsTrigger value="repair">Repair Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="issue">
          <div className="flex justify-between">
            <h1 className="font-semibold text-2xl my-2">Issue Templates</h1>
            <NewIssueTemplateModal />
          </div>
          <IssueTemplateList issueTemplates={issueTemplates} />
        </TabsContent>
        <TabsContent value="repair">
          <div className="flex justify-between">
            <h1 className="font-semibold text-2xl my-2">Repair Templates</h1>
            <NewRepairTemplateModal />
          </div>
          <RepairTemplateList repairTemplates={repairTemplates} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
