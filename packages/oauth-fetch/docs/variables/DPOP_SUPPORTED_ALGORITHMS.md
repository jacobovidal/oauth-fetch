# Variable: DPOP\_SUPPORTED\_ALGORITHMS

> `const` **DPOP\_SUPPORTED\_ALGORITHMS**: `object`

Supported cryptographic algorithms for DPoP, along with their valid parameters.
- ECDSA: P-256, P-384, P-521 curves
- RSA-PSS: 2048, 3072, 4096 bit modulus lengths
- EdDSA: Ed25519 curve

## Type declaration

### ECDSA

> `readonly` **ECDSA**: readonly \[`"P-256"`, `"P-384"`, `"P-521"`\]

### EdDSA

> `readonly` **EdDSA**: readonly \[`"Ed25519"`\]

### RSA-PSS

> `readonly` **RSA-PSS**: readonly \[`"2048"`, `"3072"`, `"4096"`\]
