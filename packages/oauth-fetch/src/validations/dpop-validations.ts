import { ERR_DESCRIPTION, ConfigurationError } from "../errors/errors.js";
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
    throw new ConfigurationError(ERR_DESCRIPTION.DPOP.REQUIRED);
  }

  const { publicKey, privateKey } = dpopKeyPair;

  if (!(publicKey instanceof CryptoKey) || !(privateKey instanceof CryptoKey)) {
    throw new ConfigurationError(ERR_DESCRIPTION.DPOP.INVALID_INSTANCE);
  }

  if (privateKey.extractable) {
    throw new ConfigurationError(
      ERR_DESCRIPTION.DPOP.PRIVATE_KEY_NON_EXPORTABLE,
    );
  }

  if (!privateKey.usages.includes("sign")) {
    throw new ConfigurationError(ERR_DESCRIPTION.DPOP.PRIVATE_KEY_SIGN_USAGE);
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
    throw new ConfigurationError(ERR_DESCRIPTION.CRYPTO.UNSUPPORTED_ALGORITHM);
  }

  if (!validOptions.includes(curveOrModulus as never)) {
    throw new ConfigurationError(
      ERR_DESCRIPTION.CRYPTO.UNSUPPORTED_ALGORITHM_CONFIGURATION,
    );
  }
}
