import { beforeAll, afterAll, afterEach, test, expect } from "vitest";
import { OAuthFetch } from "../../oauth-fetch.js";
import { BASE_URL, server } from "./setup.js";
import { MockTokenProvider } from "../mocks/token-provider.mock.js";
import { DPoPUtils } from "../../utils/dpop-utils.js";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("should fetch public endpoint successfully", async () => {
  const client = new OAuthFetch({ baseUrl: BASE_URL, isProtected: false });

  const response = await client.get("/public-endpoint");

  expect(response).toEqual({ message: "Hello public endpoint!" });
});

test("should fetch protected endpoint successfully with valid Bearer token", async () => {
  const client = new OAuthFetch({
    baseUrl: BASE_URL,
    isProtected: true,
    tokenProvider: new MockTokenProvider({
      tokenType: "Bearer",
      accessToken: "my-mock-access-token",
    }),
  });

  const response = await client.get("/protected-endpoint/bearer");

  expect(response).toEqual({
    message: "Hello protected endpoint with Bearer!",
    access_token: "my-mock-access-token",
  });
});

test("should fetch protected endpoint successfully with valid DPoP token", async () => {
  const client = new OAuthFetch({
    baseUrl: BASE_URL,
    isProtected: true,
    dpopKeyPair: await DPoPUtils.generateKeyPair(),
    tokenProvider: new MockTokenProvider({
      tokenType: "DPoP",
      accessToken: "my-mock-access-token",
    }),
  });

  const response = await client.get("/protected-endpoint/dpop");

  expect(response).toEqual({
    message: "Hello protected endpoint with DPoP!",
    access_token: "my-mock-access-token",
  });
});

test("should fetch protected endpoint successfully with valid DPoP token and nonce", async () => {
  const client = new OAuthFetch({
    baseUrl: BASE_URL,
    isProtected: true,
    dpopKeyPair: await DPoPUtils.generateKeyPair(),
    tokenProvider: new MockTokenProvider({
      tokenType: "DPoP",
      accessToken: "my-mock-access-token",
    }),
  });

  const response = await client.get("/protected-endpoint/dpop/nonce");

  expect(response).toEqual({
    message: "Hello protected endpoint with DPoP and nonce!",
    access_token: "my-mock-access-token",
    nonce: "my-dpop-nonce-value",
  });
});
