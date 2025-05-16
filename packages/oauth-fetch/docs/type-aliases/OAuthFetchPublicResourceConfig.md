# Type Alias: OAuthFetchPublicResourceConfig

> **OAuthFetchPublicResourceConfig** = `object`

Configuration for public (non-authenticated) resources

## Properties

### baseUrl

> **baseUrl**: `string`

Base URL for API requests (e.g., 'https://api.example.com')

***

### contentType?

> `optional` **contentType**: [`HttpContentType`](HttpContentType.md)

Content type for requests (defaults to JSON if not specified)

***

### isProtected

> **isProtected**: `false`

Must be explicitly set to false for public resources
