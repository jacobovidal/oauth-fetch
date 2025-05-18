# Variable: ERR\_DESCRIPTION

> `const` **ERR\_DESCRIPTION**: `object`

## Type declaration

### CRYPTO

> `readonly` **CRYPTO**: `object`

#### CRYPTO.INVALID\_CRYPTO\_RSA\_MODULUS\_LENGTH

> `readonly` **INVALID\_CRYPTO\_RSA\_MODULUS\_LENGTH**: `"RSA key modulus length must be at least 2048 bits"` = `"RSA key modulus length must be at least 2048 bits"`

#### CRYPTO.UNSUPPORTED\_ALGORITHM()

> `readonly` **UNSUPPORTED\_ALGORITHM**: (`algorithm`) => `string`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `algorithm` | `string` |

##### Returns

`string`

#### CRYPTO.UNSUPPORTED\_ALGORITHM\_CONFIGURATION()

> `readonly` **UNSUPPORTED\_ALGORITHM\_CONFIGURATION**: (`algorithm`) => `string`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `algorithm` | `"ECDSA"` \| `"RSA-PSS"` \| `"EdDSA"` |

##### Returns

`string`

#### CRYPTO.UNSUPPORTED\_ALGORITHM\_WITH\_CURVE\_OR\_MODULUS()

> `readonly` **UNSUPPORTED\_ALGORITHM\_WITH\_CURVE\_OR\_MODULUS**: (`algorithm`, `curveOrModulus`) => `string`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `algorithm` | `string` |
| `curveOrModulus` | `string` |

##### Returns

`string`

#### CRYPTO.UNSUPPORTED\_CRYPTO\_ECDSA\_CURVE()

> `readonly` **UNSUPPORTED\_CRYPTO\_ECDSA\_CURVE**: (`namedCurve`) => `string`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `namedCurve` | `string` |

##### Returns

`string`

#### CRYPTO.UNSUPPORTED\_CRYPTO\_RSA\_HASH\_ALGORITHM()

> `readonly` **UNSUPPORTED\_CRYPTO\_RSA\_HASH\_ALGORITHM**: (`hashName`) => `string`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `hashName` | `string` |

##### Returns

`string`

#### CRYPTO.UNSUPPORTED\_PUBLIC\_KEY\_TYPE()

> `readonly` **UNSUPPORTED\_PUBLIC\_KEY\_TYPE**: (`publicKeyType`) => `string`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `publicKeyType` | `string` |

##### Returns

`string`

#### CRYPTO.UNSUPPORTED\_RSA\_PSS\_HASH\_ALGORITHM()

> `readonly` **UNSUPPORTED\_RSA\_PSS\_HASH\_ALGORITHM**: (`hashName`) => `string`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `hashName` | `string` |

##### Returns

`string`

### DPOP

> `readonly` **DPOP**: `object`

#### DPOP.INVALID\_INSTANCE

> `readonly` **INVALID\_INSTANCE**: `"dpopKeyPair must contain valid CryptoKey instances for both public and private keys"` = `"dpopKeyPair must contain valid CryptoKey instances for both public and private keys"`

#### DPOP.PRIVATE\_KEY\_NON\_EXPORTABLE

> `readonly` **PRIVATE\_KEY\_NON\_EXPORTABLE**: `"dpopKeyPair.privateKey should not be exportable for security reasons"` = `"dpopKeyPair.privateKey should not be exportable for security reasons"`

#### DPOP.PRIVATE\_KEY\_SIGN\_USAGE

> `readonly` **PRIVATE\_KEY\_SIGN\_USAGE**: `"dpopKeyPair.privateKey must include 'sign' usage permission"` = `"dpopKeyPair.privateKey must include 'sign' usage permission"`

#### DPOP.REQUIRED

> `readonly` **REQUIRED**: `"dpopKeyPair is required for protected resources with DPoP token type"` = `"dpopKeyPair is required for protected resources with DPoP token type"`

### PKCE

> `readonly` **PKCE**: `object`

#### PKCE.INVALID\_CODE\_VERIFIER

> `readonly` **INVALID\_CODE\_VERIFIER**: `"Code verifier must be a non-empty string"` = `"Code verifier must be a non-empty string"`

#### PKCE.INVALID\_CODE\_VERIFIER\_LENGTH

> `readonly` **INVALID\_CODE\_VERIFIER\_LENGTH**: `"Code verifier length must be between 43 and 128 characters as per RFC 7636"` = `"Code verifier length must be between 43 and 128 characters as per RFC 7636"`

### RESPONSE

> `readonly` **RESPONSE**: `object`

#### RESPONSE.BODY\_PARSING\_ERROR

> `readonly` **BODY\_PARSING\_ERROR**: `"Failed to parse the response body"` = `"Failed to parse the response body"`

#### RESPONSE.NON\_SUCCESSFUL()

> `readonly` **NON\_SUCCESSFUL**: (`url`, `method`, `response`) => `string`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `URL` |
| `method` | `undefined` \| `string` |
| `response` | `Response` |

##### Returns

`string`

### TOKEN\_PROVIDER

> `readonly` **TOKEN\_PROVIDER**: `object`

#### TOKEN\_PROVIDER.MISSING\_ACCESS\_TOKEN

> `readonly` **MISSING\_ACCESS\_TOKEN**: `"Token provider didn't return an access_token"` = `"Token provider didn't return an access_token"`

#### TOKEN\_PROVIDER.MISSING\_TOKEN\_TYPE

> `readonly` **MISSING\_TOKEN\_TYPE**: `"Token provider didn't return a token_type"` = `"Token provider didn't return a token_type"`

#### TOKEN\_PROVIDER.REQUIRED

> `readonly` **REQUIRED**: `"tokenProvider is required for protected resources"` = `"tokenProvider is required for protected resources"`

#### TOKEN\_PROVIDER.UNSUPPORTED\_TOKEN\_TYPE()

> `readonly` **UNSUPPORTED\_TOKEN\_TYPE**: (`tokenType`) => `string`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `tokenType` | `string` |

##### Returns

`string`
