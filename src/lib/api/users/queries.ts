import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { type UserId, userIdSchema, users } from "@/lib/db/schema/users";

export const getUsers = async () => {
  const u = await db.select().from(users);
  return { users: u };
};

export const getUserById = async (id: UserId) => {
  const { id: userId } = userIdSchema.parse({ id });
  const [u] = await db.select().from(users).where(eq(users.id, userId));
  return { user: u };
};
