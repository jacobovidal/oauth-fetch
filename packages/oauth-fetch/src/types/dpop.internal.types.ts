/**
 * @internal
 * Internal type representing Web Crypto API parameters generated based on the selected cryptographic algorithm.
 */
export type CryptoParamsResult =
  | EcKeyGenParams
  | RsaHashedKeyGenParams
  | { name: "Ed25519" };
