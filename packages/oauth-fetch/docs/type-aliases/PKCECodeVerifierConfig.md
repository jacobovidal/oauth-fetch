# Type Alias: PKCECodeVerifierConfig

> **PKCECodeVerifierConfig** = `object`

Configuration for generating a PKCE code verifier.

## Properties

### length?

> `optional` **length**: `number`

The length of the code verifier in bytes.
Must be between 43 and 128 characters as per RFC 7636.

#### Default

```ts
64
```
