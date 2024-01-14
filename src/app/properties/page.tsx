import PropertyList from "@/components/properties/PropertyList";
import NewPropertyModal from "@/components/properties/PropertyModal";
import { checkAuth } from "@/lib/auth/utils";
import { MainPageWrapper } from "@/components/main-page";
import { getProperties } from "@/lib/api/properties/queries";

export default async function Properties() {
  await checkAuth();
  const { properties } = await getProperties();

  return (
    <MainPageWrapper>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Properties</h1>
        <NewPropertyModal />
      </div>
      <PropertyList properties={properties} />
    </MainPageWrapper>
  );
}
