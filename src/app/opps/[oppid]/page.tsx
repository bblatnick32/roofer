import { checkAuth } from "@/lib/auth/utils";
import { notFound } from "next/navigation";
import { getOppById } from "@/lib/api/opps/queries";
import OppMain from "./opp-main";
import { getCompanyById } from "@/lib/api/companies/queries";
import { getContactById } from "@/lib/api/contacts/queries";
import { getPropertyById } from "@/lib/api/properties/queries";

interface OppLayoutProps {
  params: {
    oppid: string;
  };
  children: React.ReactNode;
}

const OppLayout = async ({ params }: OppLayoutProps) => {
  const { oppid } = params;
  await checkAuth(`opps/${oppid}`);

  // make a call to get the opp
  const { opp } = await getOppById(Number(oppid));
  if (!opp) notFound();

  let company;
  if (opp.companyId) {
    const companyRet = await getCompanyById(opp.companyId);
    company = companyRet.company;
  }

  let property;
  if (opp.propertyId) {
    const propertyRet = await getPropertyById(opp.propertyId);
    property = propertyRet.property;
  }

  let contact;
  if (opp.contactId) {
    const contactReg = await getContactById(opp.contactId);
    contact = contactReg.contact;
  }

  return (
    <OppMain
      opp={opp}
      company={company}
      property={property}
      contact={contact}
    />
  );
};

export default OppLayout;
