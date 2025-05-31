import {
  AbstractTokenProvider,
  DPoPUtils,
  HTTP_CONTENT_TYPE,
  OAuthFetch,
  SUPPORTED_TOKEN_TYPES,
} from "oauth-fetch";
import type { DPoPKeyPair, TokenProviderGetTokenResponse } from "oauth-fetch";

export class DuendeDPoPTokenProvider extends AbstractTokenProvider {
  private tokenSet?: TokenProviderGetTokenResponse;
  private client: OAuthFetch;
  private dpopKeyPair: DPoPKeyPair;

  constructor(dpopKeyPair: DPoPKeyPair) {
    super();
    this.dpopKeyPair = dpopKeyPair;
    this.client = new OAuthFetch({
      baseUrl: "https://demo.duendesoftware.com",
      isProtected: false,
      contentType: HTTP_CONTENT_TYPE.FORM_URL_ENCODED,
    });
  }

  async getToken(): Promise<TokenProviderGetTokenResponse> {
    if (this.tokenSet) {
      return this.tokenSet;
    }

    const dpopProof = await DPoPUtils.generateProof({
      url: new URL("https://demo.duendesoftware.com/connect/token"),
      method: "POST",
      dpopKeyPair: this.dpopKeyPair,
    });

    try {
      const { access_token } = (await this.client.post(
        "/connect/token",
        {
          client_id: "m2m.dpop",
          grant_type: "client_credentials",
          client_secret: "secret",
        },
        {
          headers: {
            DPoP: dpopProof,
          },
        }
      )) as TokenProviderGetTokenResponse;

      this.tokenSet = {
        access_token,
        token_type: SUPPORTED_TOKEN_TYPES.DPOP,
      };

      return this.tokenSet;
    } catch {
      throw new Error(`Failed to retrieve token the access token'`);
    }
  }
}
