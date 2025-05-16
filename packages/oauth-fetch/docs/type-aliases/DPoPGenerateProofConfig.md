# Type Alias: DPoPGenerateProofConfig

> **DPoPGenerateProofConfig** = `object`

Configuration parameters required to generate a DPoP proof.

## Properties

### accessToken?

> `optional` **accessToken**: `string`

An optional access token to include with the proof.
This is used when the proof is tied to an access token in the Authorization: DPoP header.

***

### dpopKeyPair

> **dpopKeyPair**: [`DPoPKeyPair`](DPoPKeyPair.md)

The DPoP key pair used for signing the proof

***

### method

> **method**: [`HttpMethod`](HttpMethod.md)

The HTTP method (e.g., GET, POST, PUT) used for the request

***

### nonce?

> `optional` **nonce**: `string`

An optional nonce provided by the server for replay protection.
If a DPoP-Nonce header was returned in a previous response, include it here.

***

### url

> **url**: `URL`

The target URL for the HTTP request to which the proof is bound
