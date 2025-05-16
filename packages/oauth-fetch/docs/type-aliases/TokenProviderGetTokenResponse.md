# Type Alias: TokenProviderGetTokenResponse

> **TokenProviderGetTokenResponse** = `object`

Represents the response from a token acquisition operation.
Contains the access token and its type for use in API requests.

## Properties

### access\_token

> **access\_token**: `string`

The OAuth access token value used for API authorization.
This token should be included in the Authorization header of API requests.

***

### token\_type

> **token\_type**: [`TokenProviderTokenType`](TokenProviderTokenType.md)

The type of token returned, which determines how it should be used in requests.
Common types include "Bearer" and "DPoP" (Demonstrating Proof-of-Possession).
