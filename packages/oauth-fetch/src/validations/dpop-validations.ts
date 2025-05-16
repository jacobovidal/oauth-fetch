import {
  DPOP_ERROR_CODES,
  DPOP_ERROR_DESCRIPTIONS,
  DPoPError,
} from "../errors/dpop.error.js";
import { DPOP_SUPPORTED_ALGORITHMS } from "../constants/index.js";
import type {
  DPoPKeyPair,
  DPoPSupportedAlgorithms,
  DPoPSupportedCurveOrModulus,
} from "../types/dpop.types.js";

export function validateDpopKeyPair(
  dpopKeyPair: DPoPKeyPair | undefined,
): asserts dpopKeyPair is DPoPKeyPair {
  if (!dpopKeyPair) {
    throw new DPoPError(
      DPOP_ERROR_CODES.INVALID_CONFIGURATION,
      DPOP_ERROR_DESCRIPTIONS.REQUIRED_DPOP,
    );
  }

  const { publicKey, privateKey } = dpopKeyPair;

  if (!(publicKey instanceof CryptoKey) || !(privateKey instanceof CryptoKey)) {
    throw new DPoPError(
      DPOP_ERROR_CODES.INVALID_CONFIGURATION,
      DPOP_ERROR_DESCRIPTIONS.INVALID_DPOP_KEY_PAIR_INSTANCE,
    );
  }

  if (privateKey.extractable) {
    throw new DPoPError(
      DPOP_ERROR_CODES.INVALID_CONFIGURATION,
      DPOP_ERROR_DESCRIPTIONS.REQUIRE_PRIVATE_KEY_TO_BE_NON_EXPORTABLE,
    );
  }

  if (!privateKey.usages.includes("sign")) {
    throw new DPoPError(
      DPOP_ERROR_CODES.INVALID_CONFIGURATION,
      DPOP_ERROR_DESCRIPTIONS.REQUIRE_PRIVATE_KEY_SIGN_USAGE,
    );
  }
}

export function validateGenerateKeyPairAlgorithm({
  algorithm,
  curveOrModulus,
}: {
  algorithm: DPoPSupportedAlgorithms;
  curveOrModulus: DPoPSupportedCurveOrModulus;
}) {
  const validOptions = DPOP_SUPPORTED_ALGORITHMS[algorithm];

  if (!validOptions) {
    throw new DPoPError(
      DPOP_ERROR_CODES.INVALID_CONFIGURATION,
      DPOP_ERROR_DESCRIPTIONS.UNSUPPORTED_ALGORITHM(algorithm),
    );
  }

  if (!validOptions.includes(curveOrModulus as never)) {
    throw new DPoPError(
      DPOP_ERROR_CODES.INVALID_CONFIGURATION,
      DPOP_ERROR_DESCRIPTIONS.UNSUPPORTED_ALGORITHM_CONFIGURATION(algorithm),
    );
  }
}
