import { describe, test, expect } from "vitest";
import { DPoPUtils } from "../../utils/dpop-utils.js";
import {
  extractPublicJwk,
  hashToBase64UrlSha256,
} from "../../utils/crypto-utils.js";
import { DPOP_ERROR_DESCRIPTIONS } from "src/errors/dpop.error.js";

describe("DPoPUtils", () => {
  describe("generateKeyPair", () => {
    test("should generate a key pair with the specified algorithm and curve", async () => {
      const algorithm = "ECDSA";
      const curveOrModulus = "P-384";

      const keyPair = await DPoPUtils.generateKeyPair({
        algorithm,
        curveOrModulus,
      });

      expect(keyPair.publicKey).toBeInstanceOf(CryptoKey);
      expect(keyPair.privateKey).toBeInstanceOf(CryptoKey);

      expect(keyPair.publicKey.algorithm.name).toBe(algorithm);
      expect((keyPair.publicKey.algorithm as EcKeyAlgorithm).namedCurve).toBe(
        curveOrModulus,
      );

      expect(keyPair.privateKey.algorithm.name).toBe(algorithm);
      expect((keyPair.privateKey.algorithm as EcKeyAlgorithm).namedCurve).toBe(
        curveOrModulus,
      );
      expect(keyPair.privateKey.extractable).toBeFalsy();
    });

    test("should throw an error for unsupported algorithm and curve", async () => {
      const algorithm = "Invalid";
      const curveOrModulus = "P-999";

      await expect(
        DPoPUtils.generateKeyPair({
          // @ts-expect-error - Invalid algorithm
          algorithm,
          // @ts-expect-error - Invalid curveOrModulus
          curveOrModulus,
        }),
      ).rejects.toThrowError(
        DPOP_ERROR_DESCRIPTIONS.UNSUPPORTED_ALGORITHM(algorithm),
      );
    });

    test("should throw an error for supported algorithm but invalid curve", async () => {
      const algorithm = "ECDSA";
      const curveOrModulus = "P-999";

      DPOP_ERROR_DESCRIPTIONS.UNSUPPORTED_ALGORITHM_CONFIGURATION(algorithm);

      await expect(
        DPoPUtils.generateKeyPair({
          algorithm,
          // @ts-expect-error - Invalid curveOrModulus
          curveOrModulus,
        }),
      ).rejects.toThrowError(
        DPOP_ERROR_DESCRIPTIONS.UNSUPPORTED_ALGORITHM_CONFIGURATION(algorithm),
      );
    });
  });

  describe("generateProof", async () => {
    const url = new URL("https://api.example.com/resource");
    const method = "GET";
    const dpopKeyPair = await DPoPUtils.generateKeyPair();
    const nonce = "my-random-nonce";
    const accessToken = "my-access-token";

    test("should generate a valid DPoP proof JWT", async () => {
      const proof = await DPoPUtils.generateProof({
        url,
        method,
        dpopKeyPair,
      });

      expect(proof).toBeDefined();
      expect(typeof proof).toBe("string");

      const [headerB64, payloadB64] = proof.split(".");
      const header = JSON.parse(atob(headerB64 as string));
      const payload = JSON.parse(atob(payloadB64 as string));

      expect(header.typ).toBe("dpop+jwt");
      expect(header.alg).toBeDefined();
      expect(header.jwk).toBeDefined();

      expect(payload.htm).toBe(method.toLowerCase());
      expect(payload.htu).toBe(url.origin + url.pathname);
      expect(payload.jti).toBeDefined();
      expect(payload.iat).toBeDefined();
    });

    test("should include nonce when provided", async () => {
      const proof = await DPoPUtils.generateProof({
        url,
        method,
        dpopKeyPair,
        nonce,
      });

      const [, payloadB64] = proof.split(".");
      const payload = JSON.parse(atob(payloadB64 as string));

      expect(payload.nonce).toBe(nonce);
    });

    test("should include access token hash when provided", async () => {
      const proof = await DPoPUtils.generateProof({
        url,
        method,
        dpopKeyPair,
        accessToken,
      });

      const [, payloadB64] = proof.split(".");
      const payload = JSON.parse(atob(payloadB64 as string));

      expect(payload.ath).toBeDefined();
    });

    test("should throw an error if dpopKeyPair is not provided", async () => {
      await expect(
        // @ts-expect-error - dpopKeyPair is not provided
        DPoPUtils.generateProof({
          url,
          method,
        }),
      ).rejects.toThrowError(DPOP_ERROR_DESCRIPTIONS.REQUIRED_DPOP);
    });
  });

  describe("calculateJwkThumbprint", async () => {
    const dpopKeyPair = await DPoPUtils.generateKeyPair();

    test("should generate a valid JWK thumbprint", async () => {
      const thumbprint = await DPoPUtils.calculateJwkThumbprint(
        dpopKeyPair.publicKey,
      );

      const jwk = await extractPublicJwk(dpopKeyPair.publicKey);

      const canonicalJwk = {
        crv: jwk.crv,
        kty: jwk.kty,
        x: jwk.x,
        y: jwk.y,
      };

      const canonicalJson = JSON.stringify(
        canonicalJwk,
        Object.keys(canonicalJwk).sort(),
      );

      const expectedHashedAccessToken =
        await hashToBase64UrlSha256(canonicalJson);

      expect(thumbprint).toBe(expectedHashedAccessToken);
    });
  });
});
