import {
  type Auth0Client,
  type GetTokenSilentlyOptions,
} from "@auth0/auth0-spa-js";
import {
  AbstractTokenProvider,
  type TokenProviderGetTokenResponse,
} from "oauth-fetch";

export class Auth0TokenProvider extends AbstractTokenProvider<GetTokenSilentlyOptions> {
  private auth0;

  constructor(auth0: Auth0Client, config?: GetTokenSilentlyOptions) {
    super(config);
    this.auth0 = auth0;
  }

  async getToken(): Promise<TokenProviderGetTokenResponse> {
    try {
      const accessToken = await this.auth0.getTokenSilently(this.config);

      return {
        access_token: accessToken,
        token_type: "Bearer",
      };
    } catch {
      throw new Error("Failed to retrieve access token.");
    }
  }
}
