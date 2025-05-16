# Type Alias: DPoPKeyPair

> **DPoPKeyPair** = `object`

Cryptographic key pair used for generating and verifying DPoP token proof-of-possession.

## Properties

### privateKey

> **privateKey**: `CryptoKey`

The private key used for signing DPoP proofs

***

### publicKey

> **publicKey**: `CryptoKey`

The public key used for generating the JWK thumbprint and verifying DPoP proofs
