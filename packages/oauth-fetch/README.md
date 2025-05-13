# oauth-fetch

**oauth-fetch** is a lightweight, flexible HTTP client built on top of the native `fetch` API to simplify making requests to both public and OAuth-protected resources. Its identity-provider-agnostic design enables seamless integration with any OAuth-compliant provider, while offering fine-grained control over authentication and request handling.

## Key Features

- **🔗 Identity provider agnostic:** Integrate with any OAuth-compliant provider (e.g., Auth0) to manage the complete token lifecycle, from retrieval to refresh.
- **🔓 Flexible Authentication:** Supports `Bearer`, `DPoP`, and unauthenticated requests out-of-the-box, adapting seamlessly based on the provided token type.
- **🚀 Intelligent request handling:** Automatically sets headers based on request content type (e.g., `application/json`, `multipart/form-data`) and parses responses accordingly — no manual parsing required.
- **🎯 Granular request control**: Override global configurations per request with additional headers, query parameters, or different token providers.
- **🛠️ OAuth utilities**: Provides built-in utilities for DPoP and PKCE.
- **📦 Zero dependencies**: Built entirely on the native `fetch` API, ensuring minimal bundle size and maximum compatibility.
- **💡 Written in TypeScript:** Offering strong types, inline documentation, and an intuitive API to streamline development and prevent common errors.

## Installation

```bash
npm install oauth-fetch
```

## Token Provider

The core of `oauth-fetch`'s flexibility is the concept of Token Provider. This is an abstract class that defines the contract for managing the token lifecycle. By using a custom token provider, you can integrate with any OAuth-compliant identity provider.

### Auth0 Example

We create a custom `Auth0TokenProvider` using the `@auth0/auth0-spa-js` SDK, which retrieves access tokens from Auth0.

```typescript
// auth0-token-provider.ts

import { Auth0Client, type GetTokenSilentlyOptions } from "@auth0/auth0-spa-js";
import { AbstractTokenProvider, type TokenProviderGetTokenResponse } from "oauth-fetch";

export class Auth0TokenProvider extends AbstractTokenProvider {
  private auth0: Auth0Client;

  constructor(auth0: Auth0Client) {
    super();
    this.auth0 = auth0;
  }

  async getToken(options?: GetTokenSilentlyOptions): Promise<TokenProviderGetTokenResponse> {
    try {
      const accessToken = await this.auth0.getTokenSilently(options);

      return {
        access_token: accessToken,
        token_type: "Bearer",
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve token: ${error.message}`);
      }

      throw new Error(`Failed to retrieve token: ${String(error)}`);
    }
  }
}
```

After creating your custom `Auth0TokenProvider`, you can initialize the `OAuthFetch` client and provide the `tokenProvider` to manage the token lifecycle. Additionally, you can pass extra configuration to the `getToken()` method using `getTokenConfig` for fine-grained control over each request.

```typescript
// index.ts

import { OAuthFetch } from 'oauth-fetch';
import { Auth0Client } from "@auth0/auth0-spa-js";
import { Auth0TokenProvider } from './auth0-token-provider';

const oauthClient = new OAuthFetch({
  baseUrl: "https://api.example.com",
  tokenProvider: new Auth0TokenProvider(auth0),
});

// Make a GET request
await oauthClient.get("/me/profile");

// Make a PATCH request with a body, and passes to `getTokenSilently()` the `scope` parameter
await oauthClient.patch(
  "/me/profile",
  {
    first_name: "Jacobo",
    company_name: "Auth0",
  },
  {
    getTokenConfig: {
      authorizationParams: {
        scope: "write:profile",
      },
    },
  }
);
```

## Getting Started

### Public (No Authentication)

This mode simply performs unauthenticated HTTP requests. `isProtected` is set to `false`, so no tokens are attached to the request.

```typescript
import { OAuthFetch } from 'oauth-fetch';

const publicClient = new OAuthFetch({
  baseUrl: "https://api.example.com",
  isProtected: false,
});

// Make a GET request
await publicClient.get("/posts/e1c43825-e1a8-416b-b968-f399138050e3");
```

### Bearer Authentication

In this mode, `oauth-fetch` retrieves an access token from the provided `tokenProvider` and includes it in the `Authorization` header of every request:

```typescript
import { OAuthFetch } from 'oauth-fetch';
import { MyTokenProvider } from './my-token-provider';

const bearerClient = new OAuthFetch({
  baseUrl: "https://api.example.com",
  tokenProvider: new MyTokenProvider(),
});

// Make a GET request
await bearerClient.get("/me/profile");

// Make a PATCH request with a body
await bearerClient.patch('/me/profile', {
  first_name: 'Jacobo',
  company_name: 'Auth0'
});
```

### Demonstrating Proof-of-Possession (DPoP)

DPoP (Demonstration of Proof-of-Possession) enhances security by binding the access token to a cryptographic proof. When `oauth-fetch` is configured with a `dpopKeyPair`, it prepares the client to support DPoP if the `tokenProvider` returns a DPoP token type:

```typescript
import { OAuthFetch } from 'oauth-fetch';
import { MyTokenProvider } from './my-token-provider';

const dpopKeyPair = await DPoPUtils.generateKeyPair();

const dpopClient = new OAuthFetch({
  baseUrl: "https://api.example.com",
  tokenProvider: new MyTokenProvider(),
  dpopKeyPair,
});

// Make a GET request
await dpopClient.get("/me/profile");

// Make a PATCH request with a body
await dpopClient.patch('/me/profile', {
  first_name: 'Jacobo',
  company_name: 'Auth0'
});
```

#### DPoP Behavior
- If the `tokenProvider` returns a token of type `DPoP`, `oauth-fetch` generates a proof for every request.
- If the API responds with a `DPoP-Nonce` header, it will be cached and included in the next request's proof automatically.
- If the API returns a `DPoP-Nonce` in a `401 Unauthorized` response, `oauth-fetch` retries the request, generating a new proof with the provided nonce.
- If a `dpopKeyPair` is provided but the `tokenProvider` returns a `Bearer` token, `oauth-fetch` **will not attempt to use DPoP** for that request, falling back to `Bearer` authentication.

## Request Overrides
You can override authentication and request settings per request:

```typescript
// Include additional headers
await bearerClient.patch(
  "/me/profile",
  {
    first_name: "Jacobo",
    company_name: "Auth0",
  },
  {
    extraHeaders: {
      "Correlation-ID": "bfd3c24e-e755-45c3-af09-e00b55d80dd8",
    },
  }
);

// Disable authentication for the request
await bearerClient.get("/posts/e1c43825-e1a8-416b-b968-f399138050e3", {
  isProtected: false,
});


// Include additional native fetch options
await bearerClient.get("/posts/e1c43825-e1a8-416b-b968-f399138050e3", {
  isProtected: false,
  mode: 'cors',
  credentials: 'include',
});


// Include additional config for the abstract `getToken()` function
await oauthClient.post(
  "/me/authentication-methods/enroll",
  {
    type: "passkey",
  },
  {
    getTokenConfig: {
      authorizationParams: {
        scope: "write:authentication-methods",
      },
    },
  }
);
```

## Utilities

We provide standalone OAuth utilities that you can use directly in your flows. These utilities, such as DPoP proof generation and PKCE handling, are available as separate classes, allowing you to implement OAuth features independently without needing to use `OAuthFetch`.

### Demonstrating Proof-of-Possession (DPoP)

Generate a DPoP key pair and create cryptographic proofs that can be used for both binding tokens and securely consuming protected APIs.

```typescript
import { DPoPUtils } from 'oauth-fetch';

// Generate a DPoP key pair
const keyPair = await DPoPUtils.generateKeyPair();

// Calculate JWK Thumbprint
const jkt = await DPoPUtils.calculateJwkThumbprint(keyPair.publicKey);

// Generate a DPoP proof for a request
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5...';

const proof = await DPoPUtils.generateProof({
  url: new URL('https://api.example.com/me/profile'),
  method: 'GET',
  dpopKeyPair: keyPair,
  accessToken,
});

// Include the DPoP proof in the request headers
const response = await fetch('https://api.example.com/me/profile', {
  method: 'GET',
  headers: {
    'Authorization': `DPoP ${accessToken}`,
    'DPoP': proof,
  },
});
```

> [!NOTE]
> When using `OAuthFetch`, and if the `getToken` method returns a `DPoP` token type, we will automatically handle the generation of the DPoP proof and its inclusion in the headers.

### Proof Key for Code Exchange (PKCE)

Generate code verifiers and challenges for securely performing the authorization code flow.

```typescript
import { PKCEUtils } from 'oauth-fetch';

// Generate a code verifier
const codeVerifier = PKCEUtils.generateCodeVerifier();

// Generate a code challenge
const codeChallenge = await PKCEUtils.generateCodeChallenge(codeVerifier);

// Use in authorization request
const authUrl = new URL('https://auth.example.com/oauth/authorize');
authUrl.searchParams.set('code_challenge', codeChallenge);
authUrl.searchParams.set('code_challenge_method', 'S256');
```
