# Type Alias: OAuthFetchPrivateResourceConfig

> **OAuthFetchPrivateResourceConfig** = `object`

Configuration for protected (authenticated) resources

## Properties

### baseUrl

> **baseUrl**: `string`

Base URL for API requests (e.g., 'https://api.example.com')

***

### tokenProvider

> **tokenProvider**: [`AbstractTokenProvider`](../classes/AbstractTokenProvider.md)

Provider responsible for fetching OAuth tokens

***

### contentType?

> `optional` **contentType**: [`HttpContentType`](HttpContentType.md)

Content type for requests (defaults to JSON if not specified)

#### Default

```ts
"json"
```

***

### customFetch?

> `optional` **customFetch**: *typeof* `fetch`

Custom fetch implementation

#### Example

```ts
// Example using a custom fetch implementation
const client = new OAuthFetch({
  baseUrl: 'https://api.example.com',
  isProtected: false,
  customFetch: async (url, options) => {
    // Custom fetch logic
  }
});
```

***

### dpopKeyPair?

> `optional` **dpopKeyPair**: [`DPoPKeyPair`](DPoPKeyPair.md)

Required for DPoP authentication flow

***

### isProtected?

> `optional` **isProtected**: `true`

Whether the API requires authentication (defaults to true)

#### Default

```ts
true
```
