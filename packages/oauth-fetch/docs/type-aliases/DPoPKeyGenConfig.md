# Type Alias: DPoPKeyGenConfig

> **DPoPKeyGenConfig** = `object`

Configuration options for generating a DPoP key pair.

## Properties

### algorithm?

> `optional` **algorithm**: [`DPoPSupportedAlgorithms`](DPoPSupportedAlgorithms.md)

The cryptographic algorithm to use for generating the DPoP key pair.

#### Default

```ts
"ECDSA"
```

***

### curveOrModulus?

> `optional` **curveOrModulus**: [`DPoPSupportedCurveOrModulus`](DPoPSupportedCurveOrModulus.md)

The curve (for ECDSA/EdDSA) or modulus length (for RSA) to use.

#### Default

```ts
"P-256" for ECDSA
```
