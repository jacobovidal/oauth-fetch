/**
 * Configuration for generating a PKCE code verifier.
 */
export type PKCECodeVerifierConfig = {
  /**
   * The length of the code verifier in bytes.
   * Must be between 43 and 128 characters as per RFC 7636.
   *
   * @default 64
   */
  length?: number;
};
