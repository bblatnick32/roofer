import WorkItemList from "@/components/workItems/WorkItemList";
import NewWorkItemModal from "@/components/workItems/WorkItemModal";
import { getWorkItems } from "@/lib/api/workItems/queries";
import { checkAuth } from "@/lib/auth/utils";

export default async function WorkItems() {
  await checkAuth("workItems");
  const { workItems } = await getWorkItems();

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Work Items</h1>
        <NewWorkItemModal />
      </div>
      <WorkItemList workItems={workItems} />
    </main>
  );
}
