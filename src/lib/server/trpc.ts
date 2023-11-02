import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "../trpc/context";
import superjson from "superjson";
import { ZodError } from "zod";
import { getUserAuth } from "../auth/utils";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});
const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  const { session } = await getUserAuth();
  const user = session?.user;

  if (!user || !user.activeOrgId || !user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not authorized to perform this action",
    });
  }

  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
