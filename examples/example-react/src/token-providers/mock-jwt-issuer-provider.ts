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
  private bearerTokenSet?: TokenProviderGetTokenResponse;
  private dpopTokenSet?: TokenProviderGetTokenResponse;

  constructor(dpopKeyPair?: DPoPKeyPair) {
    super();
    this.dpopKeyPair = dpopKeyPair;
  }

  async getToken(): Promise<TokenProviderGetTokenResponse> {
    try {
      if (this.dpopKeyPair) {
        if (this.dpopTokenSet) {
          return this.dpopTokenSet;
        }

        const { publicKey } = this.dpopKeyPair;
        const jwkThumbprint = await DPoPUtils.calculateJwkThumbprint(publicKey);

        const response = await this.client.post("/jwt/sign", {
          cnf: {
            jkt: jwkThumbprint,
          },
        });

        this.dpopTokenSet = response as TokenProviderGetTokenResponse;

        return this.dpopTokenSet;
      } else {
        if (this.bearerTokenSet) {
          return this.bearerTokenSet;
        }

        const response = await this.client.post("/jwt/sign");

        this.bearerTokenSet = response as TokenProviderGetTokenResponse;

        return this.bearerTokenSet;
      }
    } catch {
      throw new Error("Failed to retrieve access token.");
    }
  }
}
