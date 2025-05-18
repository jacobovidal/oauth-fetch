# Variable: ERR\_DESCRIPTION

> `const` **ERR\_DESCRIPTION**: `object`

## Type declaration

### CRYPTO

> **CRYPTO**: `object`

#### CRYPTO.INVALID\_RSA\_MODULUS\_LENGTH

> **INVALID\_RSA\_MODULUS\_LENGTH**: `string` = `"RSA key modulus length must be at least 2048 bits"`

#### CRYPTO.UNSUPPORTED\_ALGORITHM

> **UNSUPPORTED\_ALGORITHM**: `string` = `"Unsupported algorithm"`

#### CRYPTO.UNSUPPORTED\_ALGORITHM\_CONFIGURATION

> **UNSUPPORTED\_ALGORITHM\_CONFIGURATION**: `string` = `"Unsupported configuration for this algorith"`

#### CRYPTO.UNSUPPORTED\_ECDSA\_CURVE

> **UNSUPPORTED\_ECDSA\_CURVE**: `string` = `"Unsupported ECDSA curve. Supported curves are: P-256, P-384, P-521"`

#### CRYPTO.UNSUPPORTED\_PUBLIC\_KEY\_TYPE

> **UNSUPPORTED\_PUBLIC\_KEY\_TYPE**: `string` = `"Unsupported public key type. Supported public key types are: RSA, EC, OKP"`

#### CRYPTO.UNSUPPORTED\_RSA\_HASH\_ALGORITHM

> **UNSUPPORTED\_RSA\_HASH\_ALGORITHM**: `string` = `"Unsupported RSA hash algorithm. Supported algorithms are: SHA-256, SHA-384, SHA-512"`

#### CRYPTO.UNSUPPORTED\_RSA\_PSS\_HASH\_ALGORITHM

> **UNSUPPORTED\_RSA\_PSS\_HASH\_ALGORITHM**: `string` = `"Unsupported RSA-PSS hash algorithm. Supported algorithms are: SHA-256, SHA-384, SHA-512"`

### DPOP

> **DPOP**: `object`

#### DPOP.INVALID\_INSTANCE

> **INVALID\_INSTANCE**: `string` = `"dpopKeyPair must contain valid CryptoKey instances for both public and private keys"`

#### DPOP.PRIVATE\_KEY\_NON\_EXPORTABLE

> **PRIVATE\_KEY\_NON\_EXPORTABLE**: `string` = `"dpopKeyPair.privateKey should not be exportable for security reasons"`

#### DPOP.PRIVATE\_KEY\_SIGN\_USAGE

> **PRIVATE\_KEY\_SIGN\_USAGE**: `string` = `"dpopKeyPair.privateKey must include 'sign' usage permission"`

#### DPOP.REQUIRED

> **REQUIRED**: `string` = `"dpopKeyPair is required for protected resources with DPoP token type"`

### PKCE

> **PKCE**: `object`

#### PKCE.INVALID\_CODE\_VERIFIER

> **INVALID\_CODE\_VERIFIER**: `string` = `"Code verifier must be a non-empty string"`

#### PKCE.INVALID\_CODE\_VERIFIER\_LENGTH

> **INVALID\_CODE\_VERIFIER\_LENGTH**: `string` = `"Code verifier length must be between 43 and 128 characters as per RFC 7636"`

### RESPONSE

> **RESPONSE**: `object`

#### RESPONSE.BODY\_PARSING\_ERROR

> **BODY\_PARSING\_ERROR**: `string` = `"Failed to parse the response body"`

#### RESPONSE.NON\_SUCCESSFUL()

> **NON\_SUCCESSFUL**: (`url`, `method`, `response`) => `string`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `URL` |
| `method` | `undefined` \| `string` |
| `response` | `Response` |

##### Returns

`string`

### TOKEN\_PROVIDER

> **TOKEN\_PROVIDER**: `object`

#### TOKEN\_PROVIDER.MISSING\_ACCESS\_TOKEN

> **MISSING\_ACCESS\_TOKEN**: `string` = `"Token provider didn't return an access_token"`

#### TOKEN\_PROVIDER.MISSING\_TOKEN\_TYPE

> **MISSING\_TOKEN\_TYPE**: `string` = `"Token provider didn't return a token_type"`

#### TOKEN\_PROVIDER.REQUIRED

> **REQUIRED**: `string` = `"tokenProvider is required for protected resources"`

#### TOKEN\_PROVIDER.UNSUPPORTED\_TOKEN\_TYPE

> **UNSUPPORTED\_TOKEN\_TYPE**: `string`
