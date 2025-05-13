import { DPOP_SUPPORTED_ALGORITHMS } from "../constants/index.js";
import { HttpMethod } from "./request.types.js";

/**
 * Cryptographic key pair used for generating and verifying DPoP token proof-of-possession.
 */
export type DPoPKeyPair = {
  /** The private key used for signing DPoP proofs */
  privateKey: CryptoKey;
  
  /** The public key used for generating the JWK thumbprint and verifying DPoP proofs */
  publicKey: CryptoKey;
};

/** 
 * Enum-like type representing the supported cryptographic algorithms for DPoP proof generation.
 * This type is derived from the keys of `DPOP_SUPPORTED_ALGORITHMS`.
 */
export type DPoPSupportedAlgorithms = keyof typeof DPOP_SUPPORTED_ALGORITHMS;

/** 
 * Supported curves (for ECDSA/EdDSA) or modulus lengths (for RSA) that are valid for the specified algorithm.
 * This type is based on the values associated with each algorithm in `DPOP_SUPPORTED_ALGORITHMS`.
 */
export type DPoPSupportedCurveOrModulus =
  (typeof DPOP_SUPPORTED_ALGORITHMS)[DPoPSupportedAlgorithms][number];

/**
 * Configuration options for generating a DPoP key pair.
 */
export type DPoPKeyGenConfig = {
  /** 
   * The cryptographic algorithm to use for generating the DPoP key pair.
   * @default "ECDSA"
   */
  algorithm?: DPoPSupportedAlgorithms;
  
  /** 
   * The curve (for ECDSA/EdDSA) or modulus length (for RSA) to use.
   * @default "P-256" for ECDSA
   */
  curveOrModulus?: DPoPSupportedCurveOrModulus;
};

/**
 * Configuration parameters required to generate a DPoP proof.
 */
export type DPoPGenerateProofConfig = {
  /** The target URL for the HTTP request to which the proof is bound */
  url: URL;
  
  /** The HTTP method (e.g., GET, POST, PUT) used for the request */
  method: HttpMethod;
  
  /** The DPoP key pair used for signing the proof */
  dpopKeyPair: DPoPKeyPair;
  
  /** 
   * An optional nonce provided by the server for replay protection.
   * If a DPoP-Nonce header was returned in a previous response, include it here.
   */
  nonce?: string;
  
  /** 
   * An optional access token to include with the proof.
   * This is used when the proof is tied to an access token in the Authorization: DPoP header.
   */
  accessToken?: string;
};
