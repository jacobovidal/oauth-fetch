import { describe, test, expect, beforeEach, vi, afterEach } from "vitest";
import {
  DPoPUtils,
  HTTP_CONTENT_TYPE,
  HTTP_METHOD,
  OAuthFetch,
  SUPPORTED_TOKEN_TYPES,
} from "../../index.js";
import { MockTokenProvider } from "../mocks/token-provider.mock.js";
import { ERR_DESCRIPTION } from "../../errors/errors.js";
import { HTTP_CONTENT_TYPE_HEADER } from "../../constants/index.internal.js";

type MockFetchResponseOptions = {
  status?: number;
  headers?: Headers;
  body?: Record<string, unknown>;
};

const statusTextMapping: Record<number, string> = {
  200: "OK",
  201: "Created",
  204: "No Content",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
};

function createMockFetchResponse(
  options: MockFetchResponseOptions = {},
): Promise<Response> {
  const {
    status = 200,
    headers = {
      "Content-Type": HTTP_CONTENT_TYPE_HEADER[HTTP_CONTENT_TYPE.JSON],
    },
    body = {},
  } = options;

  const parsedHeaders = new Headers();
  Object.entries(headers).forEach(([key, value]) => {
    parsedHeaders.set(key, value);
  });

  const originalGet = parsedHeaders.get;
  parsedHeaders.get = vi.fn().mockImplementation((key: string) => {
    return originalGet.call(parsedHeaders, key);
  });

  const response: Response = {
    ok: status >= 200 && status < 300,
    status,
    statusText: statusTextMapping[status] ?? "OK",
    headers: parsedHeaders,
    type: "basic",
    url: "",
    redirected: false,
    body: null,
    bodyUsed: false,
    bytes: async () => Promise.resolve(new Uint8Array(0)),
    clone: () => response,
    json: async () => body,
    text: async () => JSON.stringify(body),
    formData: async () => {
      const formData = new FormData();

      Object.entries(body).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      return formData;
    },
    arrayBuffer: async () => new ArrayBuffer(0),
    blob: async () => new Blob(),
  };

  return Promise.resolve(response);
}

describe("OAuthFetch", () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi
      .fn()
      .mockImplementation(async () => createMockFetchResponse());
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Constructor", () => {
    describe("when configuring for public resources", () => {
      test("should initialize with baseUrl", () => {
        const client = new OAuthFetch({
          baseUrl: "https://api.example.com",
          isProtected: false,
        });

        expect(client).toBeInstanceOf(OAuthFetch);
      });
    });

    describe("when configuring for protected resources", () => {
      test("should initialize with baseUrl and tokenProvider", () => {
        const client = new OAuthFetch({
          baseUrl: "https://api.example.com",
          tokenProvider: new MockTokenProvider(),
        });

        expect(client).toBeInstanceOf(OAuthFetch);
      });

      test("should initialize with baseUrl, tokenProvider and dpopKeyPair", async () => {
        const client = new OAuthFetch({
          baseUrl: "https://api.example.com",
          tokenProvider: new MockTokenProvider(),
          dpopKeyPair: await DPoPUtils.generateKeyPair(),
        });

        expect(client).toBeInstanceOf(OAuthFetch);
      });

      test("should throw error if tokenProvider is not provided", () => {
        expect(() => {
          // @ts-expect-error - tokenProvider is not provided
          new OAuthFetch({
            baseUrl: "https://api.example.com",
          });
        }).toThrowError(ERR_DESCRIPTION.TOKEN_PROVIDER.REQUIRED);
      });
    });
  });

  describe("HTTP Methods", () => {
    Object.values(HTTP_METHOD).forEach((method) => {
      describe(`.${method.toLowerCase()}()`, () => {
        describe("when calling a public resource", () => {
          test("should execute the request with the correct URL, method, headers, and body (if applicable)", async () => {
            const baseUrl = "https://api.example.com";
            const endpoint = "/posts/1";
            const overrides = {
              headers: {
                "X-Custom-Header": "CustomValue",
              },
            };
            const body = {
              foo: "bar",
            };

            const client = new OAuthFetch({
              baseUrl,
              isProtected: false,
            });

            const methodMapping = {
              GET: client.get.bind(client),
              POST: client.post.bind(client),
              PATCH: client.patch.bind(client),
              PUT: client.put.bind(client),
              DELETE: client.delete.bind(client),
            };

            if (method === HTTP_METHOD.GET) {
              await client.get(endpoint, overrides);
            } else {
              await methodMapping[method](endpoint, body, overrides);
            }

            const [url, options] = mockFetch.mock.calls[0]!;

            expect(String(url)).toBe(baseUrl + endpoint);
            expect(options.method).toBe(method);
            expect(options.headers).toBeInstanceOf(Headers);
            expect(options.headers.get("Content-Type")).toBe(
              HTTP_CONTENT_TYPE_HEADER[HTTP_CONTENT_TYPE.JSON],
            );
            expect(options.headers.get("X-Custom-Header")).toBe(
              overrides.headers["X-Custom-Header"],
            );

            if (method === HTTP_METHOD.GET) {
              expect(options.body).toBeUndefined();
            } else {
              expect(options.body).toBe(JSON.stringify(body));
            }
          });
        });

        describe("when calling a protected resource", () => {
          describe("using Bearer tokens", () => {
            test("should execute the request with Bearer Authorization headers", async () => {
              const baseUrl = "https://api.example.com";
              const endpoint = "/me/profile";
              const accessToken = "my-mock-access-token";
              const tokenType = SUPPORTED_TOKEN_TYPES.BEARER[0];
              const overrides = {
                headers: {
                  "X-Custom-Header": "CustomValue",
                },
              };

              const client = new OAuthFetch({
                baseUrl,
                tokenProvider: new MockTokenProvider({
                  tokenType,
                  accessToken,
                }),
              });

              const methodMapping = {
                GET: client.get.bind(client),
                POST: client.post.bind(client),
                PATCH: client.patch.bind(client),
                PUT: client.put.bind(client),
                DELETE: client.delete.bind(client),
              };

              if (method === HTTP_METHOD.GET) {
                await client.get(endpoint, overrides);
              } else {
                await methodMapping[method](endpoint, {}, overrides);
              }

              const [url, options] = mockFetch.mock.calls[0]!;

              expect(String(url)).toBe(baseUrl + endpoint);
              expect(options.method).toBe(method);
              expect(options.headers).toBeInstanceOf(Headers);
              expect(options.headers.get("Authorization")).toBe(
                `${tokenType} ${accessToken}`,
              );
              expect(options.headers.get("X-Custom-Header")).toBe(
                overrides.headers["X-Custom-Header"],
              );
            });

            describe("and using isProtected override", () => {
              test("should execute the request omitting Bearer Authorization headers", async () => {
                const baseUrl = "https://api.example.com";
                const endpoint = "/me/profile";
                const accessToken = "my-mock-access-token";
                const tokenType = SUPPORTED_TOKEN_TYPES.BEARER[0];
                const overrides = {
                  isProtected: false,
                  headers: {
                    "X-Custom-Header": "CustomValue",
                  },
                };

                const client = new OAuthFetch({
                  baseUrl,
                  tokenProvider: new MockTokenProvider({
                    tokenType,
                    accessToken,
                  }),
                });

                const methodMapping = {
                  GET: client.get.bind(client),
                  POST: client.post.bind(client),
                  PATCH: client.patch.bind(client),
                  PUT: client.put.bind(client),
                  DELETE: client.delete.bind(client),
                };

                if (method === HTTP_METHOD.GET) {
                  await methodMapping[method](endpoint, overrides);
                } else {
                  await methodMapping[method](endpoint, {}, overrides);
                }
                const [url, options] = mockFetch.mock.calls[0]!;

                expect(String(url)).toBe(baseUrl + endpoint);
                expect(options.method).toBe(method);
                expect(options.headers).toBeInstanceOf(Headers);
                expect(options.headers.get("Authorization")).toBeNull();
                expect(options.headers.get("X-Custom-Header")).toBe(
                  overrides.headers["X-Custom-Header"],
                );
              });
            });
          });

          describe("using DPoP tokens", () => {
            test("should execute the request with DPoP Authorization headers and valid DPoP proof", async () => {
              const baseUrl = "https://api.example.com";
              const endpoint = "/me/profile";
              const accessToken = "my-mock-access-token";
              const tokenType = SUPPORTED_TOKEN_TYPES.DPOP[0];
              const overrides = {
                headers: {
                  "X-Custom-Header": "CustomValue",
                },
              };

              const client = new OAuthFetch({
                baseUrl,
                tokenProvider: new MockTokenProvider({
                  tokenType,
                  accessToken,
                }),
                dpopKeyPair: await DPoPUtils.generateKeyPair(),
              });

              const methodMapping = {
                GET: client.get.bind(client),
                POST: client.post.bind(client),
                PATCH: client.patch.bind(client),
                PUT: client.put.bind(client),
                DELETE: client.delete.bind(client),
              };

              if (method === HTTP_METHOD.GET) {
                await methodMapping[method](endpoint, overrides);
              } else {
                await methodMapping[method](endpoint, {}, overrides);
              }

              const [url, options] = mockFetch.mock.calls[0]!;

              expect(String(url)).toBe(baseUrl + endpoint);
              expect(options.method).toBe(method);
              expect(options.headers).toBeInstanceOf(Headers);
              expect(options.headers.get("Authorization")).toBe(
                `${tokenType} ${accessToken}`,
              );
              expect(options.headers.get("X-Custom-Header")).toBe(
                overrides.headers["X-Custom-Header"],
              );

              const proof = options.headers.get("DPoP");

              const [headerB64, payloadB64] = proof.split(".");
              const header = JSON.parse(atob(headerB64 as string));
              const payload = JSON.parse(atob(payloadB64 as string));

              expect(header.typ).toBe("dpop+jwt");
              expect(header.alg).toBeDefined();
              expect(header.jwk).toBeDefined();

              expect(payload.htm).toBe(method);
              expect(payload.htu).toBe(url.origin + url.pathname);
              expect(payload.jti).toBeDefined();
              expect(payload.iat).toBeDefined();
            });

            describe("and using isProtected override", () => {
              test("should execute the request omitting DPoP Authorization headers and DPoP proof", async () => {
                const baseUrl = "https://api.example.com";
                const endpoint = "/me/profile";
                const accessToken = "my-mock-access-token";
                const tokenType = SUPPORTED_TOKEN_TYPES.DPOP[0];
                const overrides = {
                  isProtected: false,
                  headers: {
                    "X-Custom-Header": "CustomValue",
                  },
                };

                const client = new OAuthFetch({
                  baseUrl,
                  tokenProvider: new MockTokenProvider({
                    tokenType,
                    accessToken,
                  }),
                });

                const methodMapping = {
                  GET: client.get.bind(client),
                  POST: client.post.bind(client),
                  PATCH: client.patch.bind(client),
                  PUT: client.put.bind(client),
                  DELETE: client.delete.bind(client),
                };

                if (method === HTTP_METHOD.GET) {
                  await methodMapping[method](endpoint, overrides);
                } else {
                  await methodMapping[method](endpoint, {}, overrides);
                }
                const [url, options] = mockFetch.mock.calls[0]!;

                expect(String(url)).toBe(baseUrl + endpoint);
                expect(options.method).toBe(method);
                expect(options.headers).toBeInstanceOf(Headers);
                expect(options.headers.get("Authorization")).toBeNull();
                expect(options.headers.get("DPoP")).toBeNull();
                expect(options.headers.get("X-Custom-Header")).toBe(
                  overrides.headers["X-Custom-Header"],
                );
              });
            });
          });
        });
      });
    });
  });

  describe("Content-Type", () => {
    Object.values(HTTP_CONTENT_TYPE).forEach((contentType) => {
      describe(`when using contentType:  ${contentType}`, () => {
        test(`should set the Content-Type header to ${HTTP_CONTENT_TYPE_HEADER[contentType]}`, async () => {
          const baseUrl = "https://api.example.com";
          const endpoint = "/posts/1";

          const client = new OAuthFetch({
            baseUrl,
            isProtected: false,
            contentType,
          });

          await client.get(endpoint);

          const [, options] = mockFetch.mock.calls[0]!;

          expect(options.headers.get("Content-Type")).toBe(
            HTTP_CONTENT_TYPE_HEADER[contentType],
          );
        });

        test("should build the body correctly", async () => {
          const baseUrl = "https://api.example.com";
          const endpoint = "/posts/1";
          const body = {
            foo: "bar",
          };

          const client = new OAuthFetch({
            baseUrl,
            isProtected: false,
            contentType,
          });

          await client.post(endpoint, body);

          const [, options] = mockFetch.mock.calls[0]!;

          switch (contentType) {
            case HTTP_CONTENT_TYPE.JSON:
              expect(options.body).toBe(JSON.stringify(body));
              break;

            case HTTP_CONTENT_TYPE.FORM_DATA:
              expect(options.body).toBeInstanceOf(FormData);
              expect(options.body.get("foo")).toBe(body.foo);
              break;

            case HTTP_CONTENT_TYPE.TEXT:
              expect(options.body).toBe(String(body));
              break;

            case HTTP_CONTENT_TYPE.FORM_URL_ENCODED: {
              const formBody = new URLSearchParams(body);
              expect(options.body).toBe(formBody.toString());
              break;
            }

            default:
              expect(options.body).toBeInstanceOf(String);
              expect(options.body).toBe(JSON.stringify(body));
              break;
          }
        });
      });
    });
  });
});
