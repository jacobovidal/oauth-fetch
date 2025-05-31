import {
  AbstractTokenProvider,
  HTTP_CONTENT_TYPE,
  OAuthFetch,
  SUPPORTED_TOKEN_TYPES,
} from "oauth-fetch";
import type { TokenProviderGetTokenResponse } from "oauth-fetch";

export class DuendeBearerTokenProvider extends AbstractTokenProvider {
  private tokenSet?: TokenProviderGetTokenResponse;
  private client: OAuthFetch;

  constructor() {
    super();
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

    try {
      const { access_token } = (await this.client.post("/connect/token", {
        client_id: "m2m",
        grant_type: "client_credentials",
        client_secret: "secret",
      })) as TokenProviderGetTokenResponse;

      this.tokenSet = {
        access_token,
        token_type: SUPPORTED_TOKEN_TYPES.BEARER,
      };

      return this.tokenSet;
    } catch {
      throw new Error(`Failed to retrieve token the access token'`);
    }
  }
}
