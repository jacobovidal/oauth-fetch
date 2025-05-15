import { DPOP_SUPPORTED_ALGORITHMS } from "../constants/index.js";
import { DPoPSupportedAlgorithms } from "../types/dpop.types.js";

export const DPOP_ERROR_CODES = {
  INVALID_CONFIGURATION: "invalid_configuration",
} as const;

export type DPoPErrorCode =
  (typeof DPOP_ERROR_CODES)[keyof typeof DPOP_ERROR_CODES];

export const DPOP_ERROR_DESCRIPTIONS = {
  REQUIRED_DPOP:
    "dpopKeyPair is required for protected resources with DPoP token type",
  INVALID_DPOP_KEY_PAIR_INSTANCE:
    "dpopKeyPair must contain valid CryptoKey instances for both public and private keys",
  REQUIRE_PRIVATE_KEY_TO_BE_NON_EXPORTABLE:
    "dpopKeyPair.privateKey should not be exportable for security reasons",
  REQUIRE_PRIVATE_KEY_SIGN_USAGE:
    "dpopKeyPair.privateKey must include 'sign' usage permission",
  UNSUPPORTED_PUBLIC_KEY_TYPE: (publicKeyType: string) =>
    `Unsupported public key type: "${publicKeyType}". Supported public key types are: RSA, EC, OKP`,
  UNSUPPORTED_ALGORITHM: (algorithm: string) =>
    `Unsupported algorithm "${algorithm}". Supported algorithms are: ${Object.keys(
      DPOP_SUPPORTED_ALGORITHMS,
    ).join(", ")}`,
  UNSUPPORTED_ALGORITHM_CONFIGURATION: (algorithm: DPoPSupportedAlgorithms) =>
    `Unsupported configuration. For algorithm "${algorithm}", valid options are: ${DPOP_SUPPORTED_ALGORITHMS[
      algorithm
    ].join(", ")}`,
  UNSUPPORTED_ALGORITHM_WITH_CURVE_OR_MODULUS: (
    algorithm: string,
    curveOrModulus: string,
  ) =>
    `Unsupported algorithm "${algorithm}" with curve/modulus "${curveOrModulus}".`,
  UNSUPPORTED_CRYPTO_RSA_HASH_ALGORITHM: (hashName: string) =>
    `Unsupported RSA hash algorithm: ${hashName}. Supported algorithms are: SHA-256, SHA-384, SHA-512`,
  INVALID_CRYPTO_RSA_MODULUS_LENGTH:
    "RSA key modulus length must be at least 2048 bits",
  UNSUPPORTED_CRYPTO_ECDSA_CURVE: (namedCurve: string) =>
    `Unsupported ECDSA curve: ${namedCurve} . Supported curves are: P-256, P-384, P-521`,
  UNSUPPORTED_RSA_PSS_HASH_ALGORITHM: (hashName: string) =>
    `Unsupported RSA-PSS hash algorithm: ${hashName}. Supported algorithms are: SHA-256, SHA-384, SHA-512`,
} as const;

export class DPoPError extends Error {
  public readonly code: DPoPErrorCode;
  public readonly cause?: unknown;

  constructor(
    code: DPoPErrorCode,
    message: string,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = this.constructor.name;
    this.code = code;
    this.cause = options?.cause;
  }
}

// Error thrown when the configuration is invalid
export class ConfigurationError extends DPoPError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(DPOP_ERROR_CODES.INVALID_CONFIGURATION, message, options);
  }
}
