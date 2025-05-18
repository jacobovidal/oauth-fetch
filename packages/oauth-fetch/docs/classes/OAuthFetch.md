# Class: OAuthFetch

OAuth-compatible HTTP client that supports Bearer and DPoP tokens for secure API requests.

This client can be configured globally for an API with default authentication settings,
but also supports per-request overrides for accessing resources with different token
scopes, audiences, or authentication requirements.

All HTTP methods accept standard fetch options (cache, mode, credentials, signal, etc.)
in addition to the custom authentication options.

## Example

```ts
// Public API client
const publicClient = new OAuthFetch({
  baseUrl: 'https://api.example.com',
  isProtected: false
});

// Protected API with Bearer tokens
const bearerClient = new OAuthFetch({
  baseUrl: 'https://api.example.com',
  tokenProvider: new MyTokenProvider()
});

// Protected API with DPoP tokens
const dpopClient = new OAuthFetch({
  baseUrl: 'https://api.example.com',
  tokenProvider: new MyDPoPTokenProvider(),
  dpopKeyPair: await createDPoPKeyPair()
});
```

## Constructors

### Constructor

> **new OAuthFetch**(`config`): `OAuthFetch`

Initializes a new `OAuthFetch` instance with the provided configuration.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`OAuthFetchConfig`](../type-aliases/OAuthFetchConfig.md) |

#### Returns

`OAuthFetch`

#### Throws

If `isProtected` is `true` and `tokenProvider` is not provided

## Methods

### delete()

> **delete**(`endpoint`, `body?`, `options?`): `Promise`\<`unknown`\>

Makes an HTTP DELETE request.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpoint` | `string` |
| `body?` | [`RequestBody`](../type-aliases/RequestBody.md) |
| `options?` | [`RequestOptions`](../type-aliases/RequestOptions.md) |

#### Returns

`Promise`\<`unknown`\>

#### Throws

If API responds with a non-successful status code

#### Throws

If `isProtected` is `true` and `tokenProvider` is missing

#### Throws

If token provider returns a DPoP token type, and `dpopKeyPair` is missing

***

### get()

> **get**(`endpoint`, `options?`): `Promise`\<`unknown`\>

Makes an HTTP GET request.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpoint` | `string` |
| `options?` | [`RequestOptions`](../type-aliases/RequestOptions.md) |

#### Returns

`Promise`\<`unknown`\>

#### Throws

If API responds with a non-successful status code

#### Throws

If `isProtected` is `true` and `tokenProvider` is missing

#### Throws

If token provider returns a DPoP token type, and `dpopKeyPair` is missing

***

### patch()

> **patch**(`endpoint`, `body?`, `options?`): `Promise`\<`unknown`\>

Makes an HTTP PATCH request.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpoint` | `string` |
| `body?` | [`RequestBody`](../type-aliases/RequestBody.md) |
| `options?` | [`RequestOptions`](../type-aliases/RequestOptions.md) |

#### Returns

`Promise`\<`unknown`\>

#### Throws

If API responds with a non-successful status code

#### Throws

If `isProtected` is `true` and `tokenProvider` is missing

#### Throws

If token provider returns a DPoP token type, and `dpopKeyPair` is missing

***

### post()

> **post**(`endpoint`, `body?`, `options?`): `Promise`\<`unknown`\>

Makes an HTTP POST request.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpoint` | `string` |
| `body?` | [`RequestBody`](../type-aliases/RequestBody.md) |
| `options?` | [`RequestOptions`](../type-aliases/RequestOptions.md) |

#### Returns

`Promise`\<`unknown`\>

#### Throws

If API responds with a non-successful status code

#### Throws

If `isProtected` is `true` and `tokenProvider` is missing

#### Throws

If token provider returns a DPoP token type, and `dpopKeyPair` is missing

***

### put()

> **put**(`endpoint`, `body?`, `options?`): `Promise`\<`unknown`\>

Makes an HTTP PUT request.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpoint` | `string` |
| `body?` | [`RequestBody`](../type-aliases/RequestBody.md) |
| `options?` | [`RequestOptions`](../type-aliases/RequestOptions.md) |

#### Returns

`Promise`\<`unknown`\>

#### Throws

If API responds with a non-successful status code

#### Throws

If `isProtected` is `true` and `tokenProvider` is missing

#### Throws

If token provider returns a DPoP token type, and `dpopKeyPair` is missing
