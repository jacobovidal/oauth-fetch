import { AbstractTokenProvider, OAuthFetch, DPoPUtils } from "oauth-fetch";
import type { DPoPKeyPair, TokenProviderGetTokenResponse } from "oauth-fetch";

/**
 * This class `MockJwtIssuer` uses the mock-jwt-issuer service
 * available at https://github.com/jacobovidal/mock-jwt-issuer
 * to obtain signed JWT tokens for testing purposes.
 */
export class MockJwtIssuer extends AbstractTokenProvider {
  private client = new OAuthFetch({
    baseUrl: "https://auth.playground.oauthlabs.com",
    isProtected: false,
  });
  private dpopKeyPair?: DPoPKeyPair;

  constructor(dpopKeyPair?: DPoPKeyPair) {
    super();
    this.dpopKeyPair = dpopKeyPair;
  }

  async getToken(): Promise<TokenProviderGetTokenResponse> {
    try {
      if (this.dpopKeyPair) {
        const { publicKey } = this.dpopKeyPair;
        const jwkThumbprint = await DPoPUtils.calculateJwkThumbprint(publicKey);

        const response = await this.client.post("/jwt/sign", {
          cnf: {
            jwk: jwkThumbprint,
          },
        });

        return response as TokenProviderGetTokenResponse;
      } else {
        const response = await this.client.post("/jwt/sign");

        return response as TokenProviderGetTokenResponse;
      }
    } catch {
      throw new Error("Failed to retrieve access token.");
    }
  }
}
