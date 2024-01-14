"use client";
import {
  CompleteCompany,
  CompleteContact,
  CompleteOpp,
  CompleteProperty,
} from "@/lib/db";
import { MainPageWrapper } from "@/components/main-page";
import OppStagePipeline from "./opp-stage-pipeline";
import OppStatus from "./opp-status";
import PageSection from "@/components/ui/page-section";
import OppOverview from "./opp-overview";
import { trpc } from "@/lib/trpc/client";

const OppMain = ({
  opp,
  company,
  property,
  contact,
}: {
  opp: CompleteOpp;
  company?: CompleteCompany;
  property?: CompleteProperty;
  contact?: CompleteContact;
}) => {
  const { data: o } = trpc.opps.getOppById.useQuery(
    {
      id: opp.id,
    },
    {
      initialData: { opp },
      refetchOnMount: false,
    }
  );

  return (
    <div className="flex flex-col w-full gap-8">
      <MainPageWrapper className="flex flex-col gap-8">
        <div className="flex w-full">
          <div className="mr-4">
            <h1 className="text-sm text-gray-500">Opportunity</h1>
            <h1 className="font-bold text-2xl text-gray-900">{o.opp!.name}</h1>
          </div>
          <OppStagePipeline opp={o.opp!} />
        </div>
        <OppStatus opp={o.opp!} />
      </MainPageWrapper>
      <PageSection>
        <OppOverview
          opp={o.opp!}
          company={company}
          property={property}
          contact={contact}
        />
      </PageSection>
    </div>
  );
};

export default OppMain;
