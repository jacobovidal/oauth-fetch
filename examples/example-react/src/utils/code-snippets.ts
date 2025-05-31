export const publicClientSnippet = `import { OAuthFetch } from "oauth-fetch";

const client = new OAuthFetch({
  baseUrl: "https://jsonplaceholder.typicode.com",
  isProtected: false,
});

await client.get("/post/1");`;

export const bearerClientSnippet = `import { OAuthFetch } from "oauth-fetch";

import { DuendeBearerTokenProvider } from "@/utils/duende-bearer-token-provider";

const client = new OAuthFetch({
  baseUrl: "https://demo.duendesoftware.com",
  tokenProvider: new DuendeBearerTokenProvider(),
});

await client.get("/api/test");`;

export const dpopClientSnippet = `import { OAuthFetch, DPoPUtils } from "oauth-fetch";

import { DuendeDPoPTokenProvider } from "@/utils/duende-dpop-token-provider";

const keyPair = await DPoPUtils.generateKeyPair();

const client = new OAuthFetch({
  baseUrl: "https://demo.duendesoftware.com",
  tokenProvider: new DuendeDPoPTokenProvider(keyPair),
  dpopKeyPair: keyPair,
});

await client.get("/api/dpop/test");`;
