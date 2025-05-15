import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { SUPPORTED_TOKEN_TYPES } from "src/constants/index.js";

export const BASE_URL = "http://oauth-fetch.localhost";

const UnauthorizedError = HttpResponse.json(
  {
    error: "Unauthorized",
  },
  {
    status: 401,
  },
);

const RequireDPoPNonceError = HttpResponse.json(
  {
    error: "Unauthorized",
  },
  {
    status: 401,
    headers: {
      "DPoP-Nonce": "my-dpop-nonce-value",
      "WWW-Authenticate": 'DPoP error="use_dpop_nonce"',
    },
  },
);

export const handlers = [
  http.get(`${BASE_URL}/public-endpoint`, async () => {
    return HttpResponse.json(
      {
        message: "Hello public endpoint!",
      },
      {
        status: 200,
      },
    );
  }),

  http.get(`${BASE_URL}/protected-endpoint/bearer`, ({ request }) => {
    const authorizationHeader = request.headers.get("Authorization");

    if (!authorizationHeader) {
      return UnauthorizedError;
    }

    const tokenType = authorizationHeader.split(" ")[0];

    if (tokenType !== SUPPORTED_TOKEN_TYPES.BEARER[0]) {
      return UnauthorizedError;
    }

    const bearerToken = authorizationHeader.split(" ")[1];

    if (!bearerToken) {
      return UnauthorizedError;
    }

    return HttpResponse.json(
      {
        message: "Hello protected endpoint with Bearer!",
        access_token: bearerToken,
      },
      {
        status: 200,
      },
    );
  }),

  http.get(`${BASE_URL}/protected-endpoint/dpop`, ({ request }) => {
    const authorizationHeader = request.headers.get("Authorization");
    const dpopHeader = request.headers.get("DPoP");

    if (!authorizationHeader || !dpopHeader) {
      return UnauthorizedError;
    }

    const tokenType = authorizationHeader.split(" ")[0];

    if (tokenType !== SUPPORTED_TOKEN_TYPES.DPOP[0]) {
      return UnauthorizedError;
    }

    const dpopToken = authorizationHeader.split(" ")[1];

    if (!dpopToken) {
      return UnauthorizedError;
    }

    return HttpResponse.json(
      {
        message: "Hello protected endpoint with DPoP!",
        access_token: dpopToken,
      },
      {
        status: 200,
      },
    );
  }),

  http.get(`${BASE_URL}/protected-endpoint/dpop/nonce`, ({ request }) => {
    const authorizationHeader = request.headers.get("Authorization");
    const proof = request.headers.get("DPoP");

    if (!authorizationHeader || !proof) {
      return UnauthorizedError;
    }

    const tokenType = authorizationHeader.split(" ")[0];

    if (tokenType !== SUPPORTED_TOKEN_TYPES.DPOP[0]) {
      return UnauthorizedError;
    }

    const dpopToken = authorizationHeader.split(" ")[1];

    if (!dpopToken) {
      return UnauthorizedError;
    }

    const [, payloadB64] = proof.split(".");
    const payload = JSON.parse(atob(payloadB64 as string));

    if (!payload.nonce) {
      return RequireDPoPNonceError;
    }

    return HttpResponse.json(
      {
        message: "Hello protected endpoint with DPoP and nonce!",
        access_token: dpopToken,
        nonce: payload.nonce,
      },
      {
        status: 200,
      },
    );
  }),
];

export const server = setupServer(...handlers);
