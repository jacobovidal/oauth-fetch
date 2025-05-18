import {
  createSignedJwt,
  extractPublicJwk,
  generateRandomStateOrNonce,
  getJwsAlgorithm,
  hashToBase64UrlSha256,
} from "./crypto-utils.js";
import type {
  DPoPGenerateProofConfig,
  DPoPKeyGenConfig,
  DPoPKeyPair,
  DPoPSupportedAlgorithms,
  DPoPSupportedCurveOrModulus,
} from "../types/dpop.types.js";
import type { CryptoParamsResult } from "../types/dpop.internal.types.js";
import {
  validateDpopKeyPair,
  validateGenerateKeyPairAlgorithm,
} from "../validations/dpop-validations.js";
import { ERR_DESCRIPTION, ConfigurationError } from "../errors/errors.js";

/**
 * Utility class for DPoP (Demonstrating Proof-of-Possession) operations.
 *
 * DPoP is a security mechanism used in OAuth 2.0 that cryptographically binds access tokens
 * to a specific client by requiring the client to prove possession of a private key.
 * This prevents token theft and misuse, as the stolen token cannot be used without the
 * corresponding private key.
 *
 * This class provides methods to:
 * - Generate DPoP key pairs for signing proofs
 * - Calculate JWK thumbprints for authorization requests
 * - Generate DPoP proofs for HTTP requests
 *
 * @example
 * ```typescript
 * // Basic usage flow:
 *
 * // 1. Generate a DPoP key pair (once per client session)
 * const keyPair = await DPoPUtils.generateKeyPair();
 *
 * // 2. For authorization requests, calculate JWK thumbprint
 * const jkt = await DPoPUtils.calculateJwkThumbprint(keyPair.publicKey);
 *
 * // 3. Generate a DPoP proof for an API request
 * const proof = await DPoPUtils.generateProof({
 *   url: new URL("https://api.example.com/resources"),
 *   method: "GET",
 *   dpopKeyPair: keyPair,
 *   accessToken: "eyJhbGciOiJSUzI1NiIsI..." // Optional
 * });
 *
 * // 4. Use the proof in an HTTP request
 * fetch("https://api.example.com/resources", {
 *   headers: {
 *     "DPoP": proof,
 *     "Authorization": `DPoP ${accessToken}`
 *   }
 * });
 * ```
 */
export class DPoPUtils {
  private constructor() {}

  /**
   * Generates appropriate Web Crypto API parameters based on the selected algorithm and curve/modulus.
   *
   * @throws {ConfigurationError} If the algorithm or curve/modulus combination is not supported
   */
  static #getCryptoParams(
    algorithm: DPoPSupportedAlgorithms,
    curveOrModulus: DPoPSupportedCurveOrModulus,
  ): CryptoParamsResult {
    switch (algorithm) {
      case "ECDSA":
        return { name: algorithm, namedCurve: curveOrModulus };
      case "RSA-PSS":
        return {
          name: algorithm,
          modulusLength: parseInt(curveOrModulus, 10),
          publicExponent: new Uint8Array([1, 0, 1]), // 65537
          hash: "SHA-256",
        };
      case "EdDSA":
        return { name: "Ed25519" };
      default:
        throw new ConfigurationError(
          ERR_DESCRIPTION.CRYPTO.UNSUPPORTED_ALGORITHM_CONFIGURATION,
        );
    }
  }

  /**
   * Calculates the DPoP JWK Thumbprint (dpop_jkt) for a public key.
   *
   * The JWK Thumbprint is a base64url-encoded SHA-256 hash of the JSON representation
   * of the JWK, with specific formatting requirements as per RFC 7638.
   * This can be used to bind an authorization code to a DPoP key pair by including
   * it as the `dpop_jkt` parameter in authorization requests.
   *
   * @throws {ConfigurationError} If the key cannot be exported or the JWK thumbprint cannot be calculated
   *
   * @example
   * ```typescript
   * // Generate a DPoP key pair
   * const keyPair = await DPoPUtils.generateKeyPair();
   *
   * // Calculate the JWK thumbprint (dpop_jkt)
   * const jkt = await DPoPUtils.calculateJwkThumbprint(keyPair.publicKey);
   *
   * // Use the JWK thumbprint in an authorization request
   * const authUrl = new URL("https://auth.example.com/oauth/authorize");
   * authUrl.searchParams.set("client_id", "client123");
   * authUrl.searchParams.set("response_type", "code");
   * authUrl.searchParams.set("redirect_uri", "https://app.example.com/callback");
   * authUrl.searchParams.set("dpop_jkt", jkt);
   * ```
   */
  static async calculateJwkThumbprint(publicKey: CryptoKey): Promise<string> {
    const jwk = await extractPublicJwk(publicKey);

    const canonicalJwk: Record<string, unknown> = {};

    switch (jwk.kty) {
      case "RSA":
        canonicalJwk.e = jwk.e;
        canonicalJwk.kty = jwk.kty;
        canonicalJwk.n = jwk.n;
        break;
      case "EC":
        canonicalJwk.crv = jwk.crv;
        canonicalJwk.kty = jwk.kty;
        canonicalJwk.x = jwk.x;
        canonicalJwk.y = jwk.y;
        break;
      case "OKP":
        canonicalJwk.crv = jwk.crv;
        canonicalJwk.kty = jwk.kty;
        canonicalJwk.x = jwk.x;
        break;
      default:
        throw new ConfigurationError(
          ERR_DESCRIPTION.CRYPTO.UNSUPPORTED_PUBLIC_KEY_TYPE,
        );
    }

    const canonicalJson = JSON.stringify(canonicalJwk);

    return hashToBase64UrlSha256(canonicalJson);
  }

  /**
   * Generates a new DPoP key pair using the specified cryptographic algorithm and parameters.
   *
   * This method creates a cryptographic key pair that can be used for signing DPoP proofs.
   * The generated keys are non-extractable and can only be used for signing and verification.
   * Typically, you should generate a key pair once per client session and reuse it
   * for all DPoP proofs in that session.
   *
   * @throws {ConfigurationError} If the requested algorithm/curve combination is not supported
   *
   * @example
   * ```typescript
   * // Generate a key pair using default parameters (ECDSA with P-256 curve)
   * const defaultKeyPair = await DPoPUtils.generateKeyPair();
   *
   * // Generate an ECDSA key pair with the P-384 curve
   * const ecdsaKeyPair = await DPoPUtils.generateKeyPair({
   *   algorithm: "ECDSA",
   *   curveOrModulus: "P-384"
   * });
   *
   * // Generate an RSA key pair with 2048-bit modulus
   * const rsaKeyPair = await DPoPUtils.generateKeyPair({
   *   algorithm: "RSA-PSS",
   *   curveOrModulus: "2048"
   * });
   *
   * // Generate an EdDSA key pair with Ed25519 curve
   * const eddsaKeyPair = await DPoPUtils.generateKeyPair({
   *   algorithm: "EdDSA",
   *   curveOrModulus: "Ed25519"
   * });
   * ```
   */
  static async generateKeyPair({
    algorithm = "ECDSA",
    curveOrModulus = "P-256",
  }: DPoPKeyGenConfig = {}): Promise<DPoPKeyPair> {
    validateGenerateKeyPairAlgorithm({
      algorithm,
      curveOrModulus,
    });

    const keyPair = (await crypto.subtle.generateKey(
      this.#getCryptoParams(algorithm, curveOrModulus),
      false, // Non-extractable keys for security
      ["sign", "verify"],
    )) as CryptoKeyPair;

    return {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
    };
  }

  /**
   * Generates a DPoP proof JWT for a specific HTTP request.
   *
   * The proof is a JWT that binds the request to the DPoP key pair and optionally to an access token.
   * It proves possession of the private key corresponding to the public key included in the JWT header.
   * Each proof has a unique JTI (JWT ID) and a timestamp to prevent replay attacks.
   *
   * @throws {ConfigurationError} If the DPoP key pair is not properly initialized
   *
   * @example
   * ```typescript
   * // Generate a DPoP proof for a request without an access token
   * const basicProof = await DPoPUtils.generateProof({
   *   url: new URL("https://auth.example.com/oauth/token"),
   *   method: "POST",
   *   dpopKeyPair: keyPair
   * });
   *
   * // Use the proof in a request header
   * fetch("https://auth.example.com/oauth/token", {
   *   method: "POST",
   *   headers: {
   *     "DPoP": basicProof
   *   }
   * });
   *
   * // Generate a DPoP proof bound to an access token
   * const tokenProof = await DPoPUtils.generateProof({
   *   url: new URL("https://api.example.com/protected"),
   *   method: "GET",
   *   dpopKeyPair: keyPair,
   *   accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6Ikp...",
   *   nonce: "8IBTHwOdqNK..." // From previous DPoP-Nonce header
   * });
   *
   * // Use the proof with the access token to consume a protected API
   * fetch("https://api.example.com/protected", {
   *   method: "GET",
   *   headers: {
   *     "DPoP": tokenProof,
   *     "Authorization": `DPoP ${accessToken}`
   *   }
   * });
   * ```
   */
  static async generateProof({
    url,
    method,
    dpopKeyPair,
    nonce,
    accessToken,
  }: DPoPGenerateProofConfig): Promise<string> {
    validateDpopKeyPair(dpopKeyPair);

    // Create the JWT header with the public key
    const header = {
      alg: getJwsAlgorithm(dpopKeyPair.publicKey),
      typ: "dpop+jwt",
      jwk: await extractPublicJwk(dpopKeyPair.publicKey),
    };

    const payload = {
      // Issued at timestamp (seconds since epoch)
      iat: Math.floor(Date.now() / 1000),
      // Unique JWT ID to prevent replay attacks
      jti: generateRandomStateOrNonce(),
      // HTTP method
      htm: method,
      // HTTP URL (origin + path, without query or fragment)
      htu: url.origin + url.pathname,
      // Include nonce if provided by server
      ...(nonce && { nonce }),
      // Include access token hash if token is provided
      ...(accessToken && { ath: await hashToBase64UrlSha256(accessToken) }),
    };

    return createSignedJwt(header, payload, dpopKeyPair.privateKey);
  }
}
