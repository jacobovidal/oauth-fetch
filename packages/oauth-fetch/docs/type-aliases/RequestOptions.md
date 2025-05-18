# Type Alias: RequestOptions

> **RequestOptions** = `Omit`\<`RequestInit`, `"method"` \| `"body"`\> & `object`

Extended request options that support authentication overrides and all standard fetch options

## Type declaration

### isProtected?

> `optional` **isProtected**: `boolean`

Override the default protection setting for this specific request

### tokenProvider?

> `optional` **tokenProvider**: [`AbstractTokenProvider`](../classes/AbstractTokenProvider.md)

Override the default provider responsible for fetching OAuth tokens
