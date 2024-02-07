import RepairTemplateList from "@/components/repairTemplates/RepairTemplateList";
import { getRepairTemplates } from "@/lib/api/repairTemplates/queries";
import { checkAuth } from "@/lib/auth/utils";
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs";
import NewRepairTemplateModal from "@/components/repairTemplates/RepairTemplateModal";
import NewIssueTemplateModal from "@/components/issueTemplates/IssueTemplateModal";
import IssueTemplateList from "@/components/issueTemplates/IssueTemplateList";
import { getIssueTemplates } from "@/lib/api/issueTemplates/queries";
import { MainPageHeader, MainPageWrapper } from "@/components/main-page";

const Page = async () => {
  await checkAuth("templates");

  const { repairTemplates } = await getRepairTemplates();
  const { issueTemplates } = await getIssueTemplates();

  return (
    <MainPageWrapper>
      <MainPageHeader>Templates</MainPageHeader>
      <Tabs className="w-full" defaultValue="issue">
        <TabsList className="flex gap-4 border-b">
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
    </MainPageWrapper>
  );
};

export default Page;
