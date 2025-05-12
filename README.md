# oauth-fetch

## Overview

**oauth-fetch** is a lightweight, flexible fetch wrapper that simplifies making HTTP requests to both public and protected resources. Designed to be identity-provider agnostic, it seamlessly integrates with any OAuth-compliant identity provider to handle access tokens and proof-of-possession mechanisms.

### Key Features

- **Identity provider agnostic**: An abstract token provider interface allows seamless integration with any OAuth-compliant identity provider (eg. Auth0).
- **Flexible Authentication**: Support for `Bearer` and `DPoP` token types.
- **Automatic request and response handling**: Automatically parses and formats HTTP request and response bodies based on content type, reducing boilerplate and error handling.
- **Request overrides**: Easily customize individual requests with additional headers, query parameters, or different token providers without disrupting the global configuration
- **OAuth utilities**:
  - [DPoP](#demonstrating-proof-of-possession-dpop-1)
  - [PKCE](#proof-key-for-code-exchange-pkce)

## Installation

```bash
npm install oauth-fetch
```

## Token Provider

The core of `oauth-fetch` is its identity-agnostic design. This abstract class defines a contract for token acquisition and refresh.

### Auth0 Example

```typescript
import { type Auth0ContextInterface, type GetTokenSilentlyOptions } from "@auth0/auth0-react";
import { AbstractTokenProvider } from "oauth-fetch";

export interface TokenResponse {
  access_token: string;
  token_type: "Bearer" | "DPoP";
}

export class Auth0TokenProvider extends AbstractTokenProvider {
  private auth0: Auth0ContextInterface;

  constructor(auth0: Auth0ContextInterface) {
    super();
    this.auth0 = auth0;
  }

  async getToken(options?: GetTokenSilentlyOptions): Promise<TokenResponse> {
    try {
      const accessToken = await this.auth0.getAccessTokenSilently(options);

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

DPoP (Demonstration of Proof-of-Possession) enhances security by binding the access token to a cryptographic proof. When `oauth-fetch` is configured with a `dpopKeyPair`, it prepares the client to support DPoP if the `tokenProvider` returns a DPoP token type. In that case, a DPoP header is automatically generated for each request:

```
DPoP: eyJhbGciOiJFUzM4NCIsInR5cCI6ImRwb3Arand0Iiwia...
```

* If the `tokenProvider` returns a token of type `DPoP`, `oauth-fetch` generates a proof for every request.
* If the API responds with a `DPoP-Nonce` header, it will be cached and included in the next request's proof automatically.
* If the API returns a `DPoP-Nonce` in a `401 Unauthorized` response, `oauth-fetch` retries the request, generating a new proof with the provided nonce.
* If a `dpopKeyPair` is provided but the `tokenProvider` returns a `Bearer` token, `oauth-fetch` **will not attempt to use DPoP** for that request, falling back to `Bearer` authentication.


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

// Disable authentication
await bearerClient.get("/posts/e1c43825-e1a8-416b-b968-f399138050e3", {
  isProtected: false,
});
```

## Utilities

### Demonstrating Proof-of-Possession (DPoP)

Generate a DPoP key pair and create proofs for secure token binding:

```typescript
import { DPoPUtils } from 'oauth-fetch';

// Generate a DPoP key pair
const keyPair = await DPoPUtils.generateKeyPair();

// Calculate JWK Thumbprint
const jkt = await DPoPUtils.calculateJwkThumbprint(keyPair.publicKey);

// Generate a DPoP proof for a request
const proof = await DPoPUtils.generateProof({
  url: new URL('https://api.example.com/resource'),
  method: 'GET',
  dpopKeyPair: keyPair,
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5...'
});
```

### Proof Key for Code Exchange (PKCE)

Generate code verifiers and challenges for secure authorization code flow:

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
