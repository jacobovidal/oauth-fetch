export const publicClientSnippet = `const publicClient = new OAuthFetch({
  baseUrl: "https://jsonplaceholder.typicode.com",
  isProtected: false,
});

await publicClient.get("/post/1");`;

export const bearerClientSnippet = `const bearerClient = new OAuthFetch({
  baseUrl: "https://auth0.oauthlabs.com",
  tokenProvider: new Auth0TokenProvider(useAuth0()),
});

await bearerClient.get("/userinfo");`;

export const dpopClientSnippet = `const dpopKeyPair = await DPoPUtils.generateKeyPair({
  algorithm: "ECDSA",
  curveOrModulus: "P-384",
});

const dpopClient = new OAuthFetch({
  baseUrl: "https://dpoptestapi.azurewebsites.net",
  tokenProvider: new DuendeTokenProvider(dpopKeyPair),
  dpopKeyPair,
});

await dpopClient.get("/DPoP");`;
