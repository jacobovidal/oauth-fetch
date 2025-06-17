export const publicClientSnippet = `import { OAuthFetch } from "oauth-fetch";

const client = new OAuthFetch({
  baseUrl: "https://api.playground.oauthlabs.com",
  isProtected: false,
});

await client.get("/public/hello");`;

export const bearerClientSnippet = `import { OAuthFetch } from "oauth-fetch";

import { MockJwtIssuer } from "@/token-providers/mock-jwt-issuer-provider";

const client = new OAuthFetch({
  baseUrl: "https://api.playground.oauthlabs.com",
  tokenProvider: new MockJwtIssuer(),
});

await client.get("/private/bearer");`;

export const dpopClientSnippet = `import { OAuthFetch, DPoPUtils } from "oauth-fetch";

import { MockJwtIssuer } from "@/token-providers/mock-jwt-issuer-provider";

const keyPair = await DPoPUtils.generateKeyPair();

const client = new OAuthFetch({
  baseUrl: "https://api.playground.oauthlabs.com",
  tokenProvider: new MockJwtIssuer(keyPair),
  dpopKeyPair: keyPair,
});

await client.get("/private/dpop");`;
