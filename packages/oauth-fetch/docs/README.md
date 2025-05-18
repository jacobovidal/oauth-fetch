# oauth-fetch API Reference

## Classes

| Class | Description |
| ------ | ------ |
| [AbstractTokenProvider](classes/AbstractTokenProvider.md) | Abstract class representing a Token Provider responsible for managing the lifecycle of access tokens. |
| [DPoPUtils](classes/DPoPUtils.md) | Utility class for DPoP (Demonstrating Proof-of-Possession) operations. |
| [OAuthFetch](classes/OAuthFetch.md) | OAuth-compatible HTTP client that supports Bearer and DPoP tokens for secure API requests. |
| [PKCEUtils](classes/PKCEUtils.md) | Utility class for PKCE (Proof Key for Code Exchange) operations. |

## Errors

| Class | Description |
| ------ | ------ |
| [ApiResponseError](classes/ApiResponseError.md) | Error thrown when non-successful API response is returned. |
| [ApiResponseParseError](classes/ApiResponseParseError.md) | Error thrown when there's an issue parsing the API response. |
| [ConfigurationError](classes/ConfigurationError.md) | Error thrown when the configuration is invalid. |
| [TokenProviderError](classes/TokenProviderError.md) | Error thrown when there's an issue with the token provider. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [DPoPGenerateProofConfig](type-aliases/DPoPGenerateProofConfig.md) | Configuration parameters required to generate a DPoP proof. |
| [DPoPKeyGenConfig](type-aliases/DPoPKeyGenConfig.md) | Configuration options for generating a DPoP key pair. |
| [DPoPKeyPair](type-aliases/DPoPKeyPair.md) | Cryptographic key pair used for generating and verifying DPoP token proof-of-possession. |
| [DPoPSupportedAlgorithms](type-aliases/DPoPSupportedAlgorithms.md) | Enum-like type representing the supported cryptographic algorithms for DPoP proof generation. This type is derived from the keys of `DPOP_SUPPORTED_ALGORITHMS`. |
| [DPoPSupportedCurveOrModulus](type-aliases/DPoPSupportedCurveOrModulus.md) | Supported curves (for ECDSA/EdDSA) or modulus lengths (for RSA) that are valid for the specified algorithm. This type is based on the values associated with each algorithm in `DPOP_SUPPORTED_ALGORITHMS`. |
| [HttpContentType](type-aliases/HttpContentType.md) | Type representing the available HTTP content types defined in the `HTTP_CONTENT_TYPE` constant. It includes values like 'json', 'text', 'formData', and 'formUrlEncoded'. |
| [HttpMethod](type-aliases/HttpMethod.md) | Type representing the available HTTP methods defined in the `HTTP_METHOD` constant. It includes methods like 'GET', 'POST', 'PATCH', 'PUT', and 'DELETE'. |
| [OAuthFetchConfig](type-aliases/OAuthFetchConfig.md) | - |
| [OAuthFetchPrivateResourceConfig](type-aliases/OAuthFetchPrivateResourceConfig.md) | Configuration for protected (authenticated) resources |
| [OAuthFetchPublicResourceConfig](type-aliases/OAuthFetchPublicResourceConfig.md) | Configuration for public (non-authenticated) resources |
| [PKCECodeVerifierConfig](type-aliases/PKCECodeVerifierConfig.md) | Configuration for generating a PKCE code verifier. |
| [RequestBody](type-aliases/RequestBody.md) | - |
| [RequestOptions](type-aliases/RequestOptions.md) | Extended request options that support authentication overrides and all standard fetch options |
| [TokenProviderGetTokenResponse](type-aliases/TokenProviderGetTokenResponse.md) | Represents the response from a token acquisition operation. Contains the access token and its type for use in API requests. |
| [TokenProviderTokenType](type-aliases/TokenProviderTokenType.md) | - |

## Variables

| Variable | Description |
| ------ | ------ |
| [DPOP\_SUPPORTED\_ALGORITHMS](variables/DPOP_SUPPORTED_ALGORITHMS.md) | Supported cryptographic algorithms for DPoP, along with their valid parameters. - ECDSA: P-256, P-384, P-521 curves - RSA-PSS: 2048, 3072, 4096 bit modulus lengths - EdDSA: Ed25519 curve |
| [ERR\_DESCRIPTION](variables/ERR_DESCRIPTION.md) | - |
| [HTTP\_CONTENT\_TYPE](variables/HTTP_CONTENT_TYPE.md) | HTTP content type constants, representing common content types used in requests and responses. |
| [HTTP\_METHOD](variables/HTTP_METHOD.md) | Constants for HTTP methods (GET, POST, PATCH, PUT, DELETE). |
| [SUPPORTED\_TOKEN\_TYPES](variables/SUPPORTED_TOKEN_TYPES.md) | Supported OAuth token types, including case-insensitive variations for each type. |
