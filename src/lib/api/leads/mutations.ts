import { db } from "@/lib/db/client";
import { and, eq } from "drizzle-orm";
import {
  LeadId,
  NewLeadParams,
  UpdateLeadParams,
  updateLeadSchema,
  insertLeadSchema,
  leads,
  leadIdSchema,
} from "@/lib/db/schema/leads";
import { getUserAuth } from "@/lib/auth/utils";
import { getCompanyByNameRawQuery } from "../companies/queries";
import { insertCompanyFromLeadRawQuery } from "../companies/mutations";
import { insertContactFromLeadRawQuery } from "../contacts/mutations";
import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import * as schema from "@/lib/db";
import { OrgId } from "@/lib/db/schema/orgs";
import { insertOpportunityFromLeadRawQuery } from "../opportunities/mutations";
import { insertPropertiesFromLeadRawQuery } from "../properties/mutations";
import { insertOpportunityContactRawQuery } from "../opportunityContacts/mutations";
import { insertOpportunityPropertiesRawQuery } from "../opportunityProperties/mutations";

export const createLead = async (lead: NewLeadParams) => {
  const { session } = await getUserAuth();
  const newLead = insertLeadSchema.parse({
    ...lead,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db.insert(leads).values(newLead);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const convertLead = async (id: LeadId, lead: UpdateLeadParams) => {
  const { session } = await getUserAuth();
  const { id: leadId } = leadIdSchema.parse({ id });
  const newLead = updateLeadSchema.parse({
    ...lead,
    orgId: session?.user.activeOrgId!,
  });

  const orgId = newLead.orgId;

  try {
    await db.transaction(async (tx) => {
      // check to see if company already exists
      const { company } = await getCompanyByNameRawQuery({
        name: newLead.company,
        orgId,
        db: tx,
      });

      let companyId = company?.id;

      // if no company exists, create a new one and set companyId
      if (!companyId) {
        // create new company
        const cId = await insertCompanyFromLeadRawQuery({
          newCompany: {
            name: newLead.company,
            orgId,
          },
          db: tx,
        });

        companyId = cId;
      }

      // create new opportunity
      const oppId = await insertOpportunityFromLeadRawQuery({
        newOpportunity: {
          name: `${newLead.company} -`,
          orgId,
          leadId,
          companyId,
        },
        db: tx,
      });

      // create new contact
      const contactId = await insertContactFromLeadRawQuery({
        newContact: {
          ...newLead,
          leadId,
          companyId,
        },
        db: tx,
      });

      // create new opportunity contact
      await insertOpportunityContactRawQuery({
        newOpportunityContact: {
          opportunityId: oppId,
          contactId,
          orgId,
        },
        db: tx,
      });

      // create new properties
      const propIds = await insertPropertiesFromLeadRawQuery({
        newProperties: lead.properties,
        orgId,
        leadId,
        companyId,
        db: tx,
      });

      // create new opportunity properties
      await insertOpportunityPropertiesRawQuery({
        newOpportunityPropertyIds: propIds,
        orgId,
        oppId,
        db: tx,
      });

      // update lead
      await updateLeadRawQuery({
        newLead,
        leadId,
        orgId,
        db: tx,
      });
    });

    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateLead = async (id: LeadId, lead: UpdateLeadParams) => {
  const { session } = await getUserAuth();
  const { id: leadId } = leadIdSchema.parse({ id });
  const newLead = updateLeadSchema.parse({
    ...lead,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db
      .update(leads)
      .set(newLead)
      .where(
        and(eq(leads.id, leadId!), eq(leads.orgId, session?.user.activeOrgId!))
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

const updateLeadRawQuery = async ({
  newLead,
  leadId,
  orgId,
  db,
}: {
  newLead: UpdateLeadParams;
  leadId: LeadId;
  orgId: OrgId;
  db: PlanetScaleDatabase<typeof schema>;
}) => {
  const resultSetHeader = await db
    .update(leads)
    .set(newLead)
    .where(and(eq(leads.id, leadId), eq(leads.orgId, orgId)));
  return Number(resultSetHeader.insertId);
};

export const deleteLead = async (id: LeadId) => {
  const { session } = await getUserAuth();
  const { id: leadId } = leadIdSchema.parse({ id });
  try {
    await db
      .delete(leads)
      .where(
        and(eq(leads.id, leadId!), eq(leads.orgId, session?.user.activeOrgId!))
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};
