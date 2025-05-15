import { hashToBase64UrlSha256, encodeBase64Url } from "./crypto-utils.js";
import { PKCECodeVerifierConfig } from "../types/pkce.types.js";
import { DEFAULT_PKCE_CODE_VERIFIER_LENGTH } from "../constants/index.internal.js";
import {
  PKCE_ERROR_CODES,
  PKCE_ERROR_DESCRIPTIONS,
  PKCEError,
} from "../errors/pkce.errors.js";

/**
 * Utility class for PKCE (Proof Key for Code Exchange) operations.
 *
 * PKCE is an OAuth 2.0 extension that enhances security for public clients
 * (like SPAs and mobile apps) by preventing authorization code interception attacks.
 * It works by having the client generate a secret "verifier" and a derived "challenge",
 * where only the challenge is sent during authorization requests.
 *
 * This class provides methods to:
 * - Generate cryptographically secure code verifiers
 * - Create code challenges from verifiers using the S256 method
 *
 * @example
 * ```typescript
 * // Basic usage flow:
 *
 * // 1. Generate a code verifier and challenge before authorization
 * const codeVerifier = PKCEUtils.generateCodeVerifier();
 * const codeChallenge = await PKCEUtils.generateCodeChallenge(codeVerifier);
 *
 * // 2. Store the code verifier securely (e.g., in sessionStorage)
 * sessionStorage.setItem('pkce_code_verifier', codeVerifier);
 *
 * // 3. Use the code challenge in the authorization request
 * const authUrl = new URL('https://auth.example.com/oauth/authorize');
 * authUrl.searchParams.set('client_id', 'client123');
 * authUrl.searchParams.set('response_type', 'code');
 * authUrl.searchParams.set('redirect_uri', 'https://app.example.com/callback');
 * authUrl.searchParams.set('code_challenge', codeChallenge);
 * authUrl.searchParams.set('code_challenge_method', 'S256');
 *
 * // 4. Redirect the user to the authorization URL
 * window.location.href = authUrl.toString();
 *
 * // 5. After redirect back with the auth code, use the stored verifier
 * // in the token request to prove the client is the same
 * ```
 */
export class PKCEUtils {
  /**
   * Generates a cryptographically secure random code verifier for PKCE.
   *
   * The code verifier is a high-entropy random string that will be used later
   * to derive a code challenge. It must be kept confidential until the token request.
   * This method creates a verifier that meets all RFC 7636 requirements.
   *
   * @throws {Error} If the requested length is outside the allowed range (43-128)
   *
   * @example
   * ```typescript
   * // Generate a code verifier with the default length (64 characters)
   * const defaultCodeVerifier = PKCEUtils.generateCodeVerifier();
   *
   * // Generate a longer code verifier for higher security
   * const longerCodeVerifier = PKCEUtils.generateCodeVerifier({ length: 96 });
   *
   * // Store the code verifier securely for later use in the token request
   * ```
   */
  static generateCodeVerifier(config?: PKCECodeVerifierConfig): string {
    const length = config?.length ?? DEFAULT_PKCE_CODE_VERIFIER_LENGTH;

    // RFC 7636 requires code verifier to be between 43 and 128 characters
    if (length < 43 || length > 128) {
      throw new PKCEError(
        PKCE_ERROR_CODES.INVALID_CONFIGURATION,
        PKCE_ERROR_DESCRIPTIONS.INVALID_CODE_VERIFIER_LENGTH
      );
    }

    const randomValues = crypto.getRandomValues(new Uint8Array(length));

    return encodeBase64Url(randomValues);
  }

  /**
   * Generates a code challenge from the provided code verifier using the S256 method.
   *
   * The S256 method applies SHA-256 hashing to the verifier and encodes the result
   * in base64url format as specified in RFC 7636. This is the recommended and most
   * secure challenge method for PKCE.
   *
   * @throws {Error} If the input code verifier is invalid
   *
   * @example
   * ```typescript
   * // Generate a code verifier
   * const codeVerifier = PKCEUtils.generateCodeVerifier();
   *
   * // Store the code verifier securely for later use in the token request
   *
   * // Derive the code challenge from the verifier
   * const codeChallenge = await PKCEUtils.generateCodeChallenge(codeVerifier);
   *
   * // Use the challenge in an authorization request
   * const authUrl = new URL('https://auth.example.com/oauth/authorize');
   * authUrl.searchParams.set('code_challenge', codeChallenge);
   * authUrl.searchParams.set('code_challenge_method', 'S256');
   * ```
   */
  static async generateCodeChallenge(codeVerifier: string): Promise<string> {
    if (!codeVerifier) {
      throw new PKCEError(
        PKCE_ERROR_CODES.INVALID_CONFIGURATION,
        PKCE_ERROR_DESCRIPTIONS.INVALID_CODE_VERIFIER
      );
    }

    return hashToBase64UrlSha256(codeVerifier);
  }
}
