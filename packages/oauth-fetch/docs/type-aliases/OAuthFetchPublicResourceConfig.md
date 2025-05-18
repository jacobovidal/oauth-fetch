# Type Alias: OAuthFetchPublicResourceConfig

> **OAuthFetchPublicResourceConfig** = `object`

Configuration for public (non-authenticated) resources

## Properties

### baseUrl

> **baseUrl**: `string`

Base URL for API requests (e.g., 'https://api.example.com')

***

### isProtected

> **isProtected**: `false`

Must be explicitly set to false for public resources

***

### contentType?

> `optional` **contentType**: [`HttpContentType`](HttpContentType.md)

Content type for requests (defaults to JSON if not specified)

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
