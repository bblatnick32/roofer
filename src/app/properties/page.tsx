import PropertyList from "@/components/properties/PropertyList";
import NewPropertyModal from "@/components/properties/PropertyModal";
import { api } from "@/lib/trpc/api";
import { checkAuth } from "@/lib/auth/utils";

export default async function Properties() {
  await checkAuth();
  const { properties } = await api.properties.getProperties.query();  

  return (
    <main className="max-w-3xl mx-auto p-4 rounded-lg bg-card">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Properties</h1>
        <NewPropertyModal />
      </div>
      <PropertyList properties={properties} />
    </main>
  );
}
