import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { MutationCtx } from "./_generated/server";

/**
 * Internal helper to generate or rotate keys
 */
async function generateOrRotateKeys(ctx: MutationCtx, userId: string) {
  // Check if user already has keys
  const existing = await ctx.db
    .query("agenticSignatures")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();

  // Generate keypair (mock for now - will use crypto.subtle in production)
  const timestamp = Date.now();
  const publicKey = `ps_pub_${userId.substring(0, 8)}_${timestamp}`;
  const privateKey = `ps_priv_${userId.substring(0, 8)}_${timestamp}_${Math.random()
    .toString(36)
    .substring(2, 15)}`;

  // TODO: Use proper cryptography in production
  // const keyPair = await crypto.subtle.generateKey(
  //   {
  //     name: "ECDSA",
  //     namedCurve: "P-256",
  //   },
  //   true,
  //   ["sign", "verify"]
  // );
  // const publicKey = await exportPublicKey(keyPair.publicKey);
  // const privateKey = await exportPrivateKey(keyPair.privateKey);
  // const encryptedPrivateKey = await encryptKey(privateKey, userId);

  if (existing) {
    // Rotate existing keys
    await ctx.db.patch(existing._id, {
      publicKey,
      privateKey, // TODO: Encrypt before storing
      lastRotated: Date.now(),
    });

    return {
      publicKey,
      rotated: true,
    };
  } else {
    // Create new keys
    await ctx.db.insert("agenticSignatures", {
      userId,
      publicKey,
      privateKey, // TODO: Encrypt before storing
      createdAt: Date.now(),
    });

    return {
      publicKey,
      rotated: false,
    };
  }
}

/**
 * Generate new public/private keypair for user
 * Used for agentic trust signals in multi-agent workflows
 */
export const generateKeys = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    return await generateOrRotateKeys(ctx, userId);
  },
});

/**
 * Get user's current public key
 */
export const getPublicKey = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    const signature = await ctx.db
      .query("agenticSignatures")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!signature) {
      return null;
    }

    return {
      publicKey: signature.publicKey,
      createdAt: signature.createdAt,
      lastRotated: signature.lastRotated,
    };
  },
});

/**
 * Get user's private key (only for authenticated user)
 * NEVER expose this via API - only for client-side signing
 */
export const getPrivateKey = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    const signature = await ctx.db
      .query("agenticSignatures")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!signature) {
      return null;
    }

    // TODO: Decrypt private key before returning
    // const decryptedKey = await decryptKey(signature.privateKey, userId);

    return {
      privateKey: signature.privateKey,
      publicKey: signature.publicKey,
    };
  },
});

/**
 * Verify a public key exists (for other users to check)
 */
export const verifyPublicKey = query({
  args: {
    publicKey: v.string(),
  },
  handler: async (ctx, args) => {
    const signature = await ctx.db
      .query("agenticSignatures")
      .withIndex("by_publicKey", (q) => q.eq("publicKey", args.publicKey))
      .first();

    return {
      valid: !!signature,
      createdAt: signature?.createdAt,
    };
  },
});

/**
 * Rotate keys (generates new keypair, invalidates old)
 */
export const rotateKeys = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    return await generateOrRotateKeys(ctx, userId);
  },
});
