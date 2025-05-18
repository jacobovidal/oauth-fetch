import { ERR_DESCRIPTION, ConfigurationError } from "../errors/errors.js";
import { DPoPKeyPair } from "../types/dpop.types.js";

/**
 * Encodes a Uint8Array to a base64url string (RFC 4648)
 */
export function encodeBase64Url(byteArray: Uint8Array): string {
  const base64String = btoa(String.fromCharCode(...byteArray));

  return base64String
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Generates a cryptographically secure random string for use as `state`, `nonce`, or `jti`.
 *
 * @param byteLength - The number of random bytes to generate (default: 32).
 * @returns A URL-safe, Base64-encoded random string.
 */
export function generateRandomStateOrNonce(byteLength = 32): string {
  return encodeBase64Url(crypto.getRandomValues(new Uint8Array(byteLength)));
}

/**
 * Extracts the public key components from a CryptoKey and returns them as a JWK
 */
export async function extractPublicJwk(key: CryptoKey) {
  const { kty, e, n, x, y, crv } = await crypto.subtle.exportKey("jwk", key);

  return { kty, e, n, x, y, crv };
}

/**
 * Creates a base64url-encoded SHA-256 hash of the provided string value.
 *
 * @param value - The string value to hash
 * @returns Promise resolving to the base64url-encoded SHA-256 hash string
 */
export async function hashToBase64UrlSha256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const valueBytes = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", valueBytes);

  return encodeBase64Url(new Uint8Array(hashBuffer));
}

/**
 * Determines the appropriate JWS algorithm name for an RSA key
 */
export function getRsaAlgorithm(key: CryptoKey): string {
  const hashName = (key.algorithm as RsaHashedKeyAlgorithm).hash.name;

  switch (hashName) {
    case "SHA-256":
      return "RS256";
    case "SHA-384":
      return "RS384";
    case "SHA-512":
      return "RS512";
    default:
      throw new ConfigurationError(
        ERR_DESCRIPTION.CRYPTO.UNSUPPORTED_CRYPTO_RSA_HASH_ALGORITHM(hashName),
      );
  }
}

/**
 * Determines the appropriate JWS algorithm name for an RSA-PSS key
 */
export function getRsaPssAlgorithm(key: CryptoKey): string {
  const hashName = (key.algorithm as RsaHashedKeyAlgorithm).hash.name;

  switch (hashName) {
    case "SHA-256":
      return "PS256";
    case "SHA-384":
      return "PS384";
    case "SHA-512":
      return "PS512";
    default:
      throw new ConfigurationError(
        ERR_DESCRIPTION.CRYPTO.UNSUPPORTED_RSA_PSS_HASH_ALGORITHM(hashName),
      );
  }
}

/**
 * Determines the appropriate JWS algorithm name for an ECDSA key
 */
export function getEcdsaAlgorithm(key: CryptoKey): string {
  const namedCurve = (key.algorithm as EcKeyAlgorithm).namedCurve;

  switch (namedCurve) {
    case "P-256":
      return "ES256";
    case "P-384":
      return "ES384";
    case "P-521":
      return "ES512";
    default:
      throw new ConfigurationError(
        ERR_DESCRIPTION.CRYPTO.UNSUPPORTED_CRYPTO_ECDSA_CURVE(namedCurve),
      );
  }
}

/**
 * Maps a CryptoKey to its corresponding JWS algorithm identifier
 */
export function getJwsAlgorithm(key: CryptoKey): string {
  switch (key.algorithm.name) {
    case "RSA-PSS":
      return getRsaPssAlgorithm(key);
    case "RSASSA-PKCS1-v1_5":
      return getRsaAlgorithm(key);
    case "ECDSA":
      return getEcdsaAlgorithm(key);
    case "Ed25519":
    case "EdDSA":
      return "Ed25519";
    default:
      throw new ConfigurationError(
        ERR_DESCRIPTION.CRYPTO.UNSUPPORTED_ALGORITHM(key.algorithm.name),
      );
  }
}

/**
 * Determines the appropriate hash algorithm name for an ECDSA key based on its curve
 */
export function getEcdsaHashAlgorithm(key: CryptoKey): string {
  const namedCurve = (key.algorithm as EcKeyAlgorithm).namedCurve;

  switch (namedCurve) {
    case "P-256":
      return "SHA-256";
    case "P-384":
      return "SHA-384";
    case "P-521":
      return "SHA-512";
    default:
      throw new ConfigurationError(
        ERR_DESCRIPTION.CRYPTO.UNSUPPORTED_CRYPTO_ECDSA_CURVE(namedCurve),
      );
  }
}

/**
 * Validates that an RSA key meets security requirements
 */
export function validateRsaKey(key: CryptoKey): void {
  const algorithm = key.algorithm as RsaHashedKeyAlgorithm;

  if (
    typeof algorithm.modulusLength !== "number" ||
    algorithm.modulusLength < 2048
  ) {
    throw new ConfigurationError(
      ERR_DESCRIPTION.CRYPTO.INVALID_CRYPTO_RSA_MODULUS_LENGTH,
    );
  }
}

/**
 * Converts a CryptoKey to the appropriate subtle crypto algorithm identifier for signing
 */
export function getSigningParams(
  key: CryptoKey,
): AlgorithmIdentifier | RsaPssParams | EcdsaParams {
  switch (key.algorithm.name) {
    case "ECDSA":
      return {
        name: key.algorithm.name,
        hash: getEcdsaHashAlgorithm(key),
      } as EcdsaParams;
    case "RSA-PSS": {
      validateRsaKey(key);
      const hashName = (key.algorithm as RsaHashedKeyAlgorithm).hash.name;

      switch (hashName) {
        case "SHA-256":
        case "SHA-384":
        case "SHA-512": {
          // Extract the bit length from hash name (e.g., "SHA-256" -> 256) and convert to bytes
          const saltLength = parseInt(hashName.slice(-3), 10) >> 3;
          return {
            name: key.algorithm.name,
            saltLength,
          } as RsaPssParams;
        }
        default:
          throw new ConfigurationError(
            ERR_DESCRIPTION.CRYPTO.UNSUPPORTED_RSA_PSS_HASH_ALGORITHM(hashName),
          );
      }
    }
    case "RSASSA-PKCS1-v1_5":
      validateRsaKey(key);
      return key.algorithm.name;
    case "Ed25519":
      return key.algorithm.name;
    default:
      throw new ConfigurationError(
        ERR_DESCRIPTION.CRYPTO.UNSUPPORTED_ALGORITHM(key.algorithm.name),
      );
  }
}

/**
 * Signs a payload using the provided export function key to create a JWT
 */
export async function createSignedJwt(
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
  privateKey: DPoPKeyPair["privateKey"],
): Promise<string> {
  const encodeObject = (data: Record<string, unknown>) =>
    encodeBase64Url(new TextEncoder().encode(JSON.stringify(data)));

  const encodedHeader = encodeObject(header);
  const encodedPayload = encodeObject(payload);
  const input = `${encodedHeader}.${encodedPayload}`;

  const signatureBuffer = await crypto.subtle.sign(
    getSigningParams(privateKey),
    privateKey,
    new TextEncoder().encode(input),
  );

  const signature = encodeBase64Url(new Uint8Array(signatureBuffer));

  return `${input}.${signature}`;
}
