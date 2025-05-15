import { DPOP_SUPPORTED_ALGORITHMS } from "src/constants/index.js";
import { DPoPSupportedAlgorithms } from "../types/dpop.types.js";

export class DPoPError extends Error {}

export const DPOP_ERROR_CODES = {
  INVALID_CONFIGURATION: "invalid_configuration",
};

export const DPOP_ERROR_DESCRIPTIONS = {
  REQUIRED_DPOP:
    "dpopKeyPair is required for protected resources with DPoP token type",
  INVALID_DPOP_KEY_PAIR_INSTANCE:
    "dpopKeyPair must contain valid CryptoKey instances for both public and private keys",
  REQUIRE_PRIVATE_KEY_TO_BE_NON_EXPORTABLE:
    "dpopKeyPair.privateKey should not be exportable for security reasons",
  REQUIRE_PRIVATE_KEY_SIGN_USAGE:
    "dpopKeyPair.privateKey must include 'sign' usage permission",
  UNSUPPORTED_ALGORITHM: (algorithm: string) =>
    `Unsupported algorithm "${algorithm}". Supported algorithms are: ${Object.keys(
      DPOP_SUPPORTED_ALGORITHMS
    ).join(", ")}`,
  UNSUPPORTED_ALGORITHM_CONFIGURATION: (algorithm: DPoPSupportedAlgorithms) =>
    `Unsupported configuration. For algorithm "${algorithm}", valid options are: ${DPOP_SUPPORTED_ALGORITHMS[
      algorithm
    ].join(", ")}`,
};
