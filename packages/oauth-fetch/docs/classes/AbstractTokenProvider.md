# Class: `abstract` AbstractTokenProvider\<TokenProviderGetTokenConfig\>

Abstract class representing a Token Provider responsible for managing the
lifecycle of access tokens.

This class defines the contract for acquiring, refreshing, and caching tokens.
By extending this class, you can implement custom strategies for interacting with identity
providers such as Auth0, Clerk, WorkOS, or any other OAuth-compliant service.

It also provides a mechanism to override the configuration for token
acquisition per request, enabling granular control over authorization
parameters.

## Example

```typescript
import { AbstractTokenProvider, type TokenProviderGetTokenResponse } from "oauth-fetch";
import { Auth0Client, GetTokenSilentlyOptions } from "@auth0/auth0-spa-js";

export class Auth0TokenProvider extends AbstractTokenProvider<GetTokenSilentlyOptions> {
  private auth0: Auth0Client;

  constructor(auth0: Auth0Client, config?: GetTokenSilentlyOptions) {
    super(config);
    this.auth0 = auth0;
  }

  async getToken(): Promise<TokenProviderGetTokenResponse> {
    try {
      const accessToken = await this.auth0.getTokenSilently(this.config);
      return {
        access_token: accessToken,
        token_type: "Bearer",
      };
    } catch {
      throw new Error("Failed to retrieve access token.");
    }
  }
}
```

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TokenProviderGetTokenConfig` | `unknown` |

## Indexable

\[`key`: `string`\]: `unknown`

Allows any property to be dynamically attached to the instance.

## Constructors

### Constructor

> **new AbstractTokenProvider**\<`TokenProviderGetTokenConfig`\>(`config?`): `AbstractTokenProvider`\<`TokenProviderGetTokenConfig`\>

Initializes a new instance of the `AbstractTokenProvider`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config?` | `TokenProviderGetTokenConfig` |

#### Returns

`AbstractTokenProvider`\<`TokenProviderGetTokenConfig`\>

## Methods

### getToken()

> `abstract` **getToken**(): `Promise`\<[`TokenProviderGetTokenResponse`](../type-aliases/TokenProviderGetTokenResponse.md)\>

Retrieves a valid OAuth access token for API requests.

This method should be responsible for the entire token lifecycle management:
- Returning cached tokens if they're still valid
- Refreshing expired tokens automatically when possible
- Handling token acquisition when no valid token is available
- Implementing appropriate error handling for token-related failures

Implementations should be designed to minimize overhead by efficiently
caching tokens and only performing network requests when necessary.

#### Returns

`Promise`\<[`TokenProviderGetTokenResponse`](../type-aliases/TokenProviderGetTokenResponse.md)\>

#### Throws

If `access_token` is not returned

#### Throws

If `token_type` is not returned

#### Throws

If `token_type` is not supported

***

### withConfigOverrides()

> **withConfigOverrides**(`overrides`): `this`

Creates a new instance of the token provider with overridden `getToken` config.

This method allows you to generate a modified instance of the token provider
with specific configuration changes. Only the matching properties are overridden,
while the rest of the configuration remains unchanged. This is ideal for fine-tuning
authorization scopes or parameters on a per-request basis without affecting the
original instance.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `overrides` | `Partial`\<`TokenProviderGetTokenConfig`\> |

#### Returns

`this`

#### Example

```typescript
const newTokenProvider = tokenProvider.withConfigOverrides({
  authorizationParams: {
    scope: "write:profile",
  },
});
```
