# Type Alias: RequestOptions

> **RequestOptions** = `Omit`\<`RequestInit`, `"method"` \| `"body"` \| `"headers"`\> & `object`

Extended request options that support authentication overrides and all standard fetch options

## Type declaration

### extraHeaders?

> `optional` **extraHeaders**: `RequestInit`\[`"headers"`\]

Additional headers to be included with the request

### isProtected?

> `optional` **isProtected**: `boolean`

Override the default protection setting for this specific request

### tokenProvider?

> `optional` **tokenProvider**: [`AbstractTokenProvider`](../classes/AbstractTokenProvider.md)

Override the default provider responsible for fetching OAuth tokens
