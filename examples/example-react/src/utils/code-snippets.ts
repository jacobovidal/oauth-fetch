export const publicClientSnippet = `import { OAuthFetch } from "oauth-fetch";

const publicClient = new OAuthFetch({
  baseUrl: "https://jsonplaceholder.typicode.com",
  isProtected: false,
});

await publicClient.get("/post/1");`;

export const bearerClientSnippet = `import { OAuthFetch } from "oauth-fetch";
import { useAuth0 } from "@auth0/auth0-react";

import { Auth0TokenProvider } from "@/utils/auth0-token-provider";

const auth0 = useAuth0();

const bearerClient = new OAuthFetch({
  baseUrl: "https://auth0.oauthlabs.com",
  tokenProvider: new Auth0TokenProvider(auth0),
});

await bearerClient.get("/userinfo");`;

export const dpopClientSnippet = `import { OAuthFetch, DPoPUtils } from "oauth-fetch";

import { DuendeTokenProvider } from "@/utils/duende-token-provider";

const dpopKeyPair = await DPoPUtils.generateKeyPair({
  algorithm: "ECDSA",
  curveOrModulus: "P-384",
});

const dpopClient = new OAuthFetch({
  baseUrl: "https://dpoptestapi.azurewebsites.net",
  tokenProvider: new DuendeTokenProvider(dpopKeyPair),
  dpopKeyPair,
});

await dpopClient.get("/DPoP");`;
