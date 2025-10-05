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
import type * as agentQueries from "../agentQueries.js";
import type * as agenticUX from "../agenticUX.js";
import type * as aiConnectors from "../aiConnectors.js";
import type * as alphaRequests from "../alphaRequests.js";
import type * as alphaSignups from "../alphaSignups.js";
import type * as conversationFeedback from "../conversationFeedback.js";
import type * as featureRequests from "../featureRequests.js";
import type * as feedback from "../feedback.js";
import type * as mockConversations from "../mockConversations.js";
import type * as newsletter from "../newsletter.js";
import type * as papersNewsletter from "../papersNewsletter.js";
import type * as researchPapers from "../researchPapers.js";
import type * as userInteractions from "../userInteractions.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  agentQueries: typeof agentQueries;
  agenticUX: typeof agenticUX;
  aiConnectors: typeof aiConnectors;
  alphaRequests: typeof alphaRequests;
  alphaSignups: typeof alphaSignups;
  conversationFeedback: typeof conversationFeedback;
  featureRequests: typeof featureRequests;
  feedback: typeof feedback;
  mockConversations: typeof mockConversations;
  newsletter: typeof newsletter;
  papersNewsletter: typeof papersNewsletter;
  researchPapers: typeof researchPapers;
  userInteractions: typeof userInteractions;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
