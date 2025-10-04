/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as alphaRequests from "../alphaRequests.js";
import type * as alphaSignups from "../alphaSignups.js";
import type * as feedback from "../feedback.js";
import type * as newsletter from "../newsletter.js";
import type * as papersNewsletter from "../papersNewsletter.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  alphaRequests: typeof alphaRequests;
  alphaSignups: typeof alphaSignups;
  feedback: typeof feedback;
  newsletter: typeof newsletter;
  papersNewsletter: typeof papersNewsletter;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
