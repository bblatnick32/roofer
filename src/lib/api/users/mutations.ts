import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import {
  UserId,
  NewUserParams,
  UpdateUserParams,
  updateUserSchema,
  insertUserSchema,
  users,
  userIdSchema,
} from "@/lib/db/schema/users";

export const createUser = async (user: NewUserParams) => {
  const newUser = insertUserSchema.parse(user);
  try {
    await db.insert(users).values(newUser);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateUser = async (id: UserId, user: UpdateUserParams) => {
  const { id: userId } = userIdSchema.parse({ id });
  const newUser = updateUserSchema.parse(user);
  try {
    await db.update(users).set(newUser).where(eq(users.id, userId!));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteUser = async (id: UserId) => {
  const { id: userId } = userIdSchema.parse({ id });
  try {
    await db.delete(users).where(eq(users.id, userId!));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};
