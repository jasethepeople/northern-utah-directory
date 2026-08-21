import { z } from "zod";
import Stripe from "stripe";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createClaim, createLead, createReview, getAttorneyBySlug, getOwnerLeads, getReviewAggregate, getReviews, listAttorneys } from "./db";
import { sendOwnerAlert } from "./email";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  directory: router({
    list: publicProcedure.input(z.object({ search: z.string().optional(), city: z.string().optional(), practiceArea: z.string().optional() }).optional()).query(({ input }) => listAttorneys(input)),
    profile: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => getAttorneyBySlug(input.slug)),
    reviews: publicProcedure.input(z.object({ attorneyId: z.number() })).query(({ input }) => getReviews(input.attorneyId)),
    reviewAggregate: publicProcedure.input(z.object({ attorneyId: z.number() })).query(({ input }) => getReviewAggregate(input.attorneyId)),
  }),
  reviews: router({
    submit: publicProcedure.input(z.object({ attorneyId: z.number(), reviewerName: z.string().min(2), rating: z.number().int().min(1).max(5), body: z.string().min(10) })).mutation(async ({ input }) => {
      await createReview(input);
      return { success: true, message: "Thank you. Your review is queued for moderation before publication." };
    }),
  }),
  leads: router({
    submit: publicProcedure.input(z.object({ attorneyId: z.number(), name: z.string().min(2), email: z.string().email(), phone: z.string().optional(), caseType: z.string().min(2), message: z.string().min(20) })).mutation(async ({ input }) => {
      const id = await createLead(input);
      const content = `New inquiry for attorney #${input.attorneyId} from ${input.name} (${input.email}). Case type: ${input.caseType}.\n\n${input.message}`;
      const notified = await notifyOwner({ title: "New attorney directory lead", content });
      const emailed = await sendOwnerAlert({ subject: `New lead inquiry from ${input.name}`, text: content });
      return { success: true, id, notified: notified || emailed };
    }),
  }),
  claims: router({
    submit: protectedProcedure.input(z.object({ attorneyId: z.number(), message: z.string().optional() })).mutation(async ({ ctx, input }) => {
      const id = await createClaim({ attorneyId: input.attorneyId, userId: ctx.user.id, message: input.message });
      const content = `${ctx.user.name ?? "A user"} submitted a claim for attorney #${input.attorneyId}.`;
      await notifyOwner({ title: "New attorney profile claim", content });
      await sendOwnerAlert({ subject: "New attorney profile claim", text: content });
      return { success: true, id };
    }),
  }),
  owner: router({
    leads: protectedProcedure.query(({ ctx }) => getOwnerLeads(ctx.user.id)),
    startSubscription: protectedProcedure.mutation(async ({ ctx }) => {
      if (!stripe) return { url: null, error: "Stripe is not configured yet." };
      const origin = ctx.req.headers.origin ?? "http://localhost:3000";
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: ctx.user.email ?? undefined,
        line_items: [{ price_data: { currency: "usd", product_data: { name: "Verified premium attorney listing" }, recurring: { interval: "month" }, unit_amount: 4900 }, quantity: 1 }],
        client_reference_id: ctx.user.id.toString(),
        metadata: { user_id: ctx.user.id.toString(), customer_email: ctx.user.email ?? "", customer_name: ctx.user.name ?? "" },
        allow_promotion_codes: true,
        success_url: `${origin}/portal?subscription=success`,
        cancel_url: `${origin}/portal?subscription=cancelled`,
      });
      const content = `${ctx.user.name ?? "A user"} started a $49/month premium listing checkout.`;
      await notifyOwner({ title: "New attorney subscription checkout", content });
      await sendOwnerAlert({ subject: "New Juris North subscription activation", text: content });
      return { url: session.url, error: null };
    }),
  }),
});

export type AppRouter = typeof appRouter;
