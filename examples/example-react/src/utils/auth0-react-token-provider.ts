import {
  type Auth0ContextInterface,
  type GetTokenSilentlyOptions,
} from "@auth0/auth0-react";
import {
  AbstractTokenProvider,
  type TokenProviderGetTokenResponse,
} from "oauth-fetch";

export class Auth0TokenProvider extends AbstractTokenProvider<GetTokenSilentlyOptions> {
  private auth0: Auth0ContextInterface;

  constructor(auth0: Auth0ContextInterface, config?: GetTokenSilentlyOptions) {
    super(config);
    this.auth0 = auth0;
  }

  async getToken(): Promise<TokenProviderGetTokenResponse> {
    try {
      const accessToken = await this.auth0.getAccessTokenSilently(this.config);

      return {
        access_token: accessToken,
        token_type: "Bearer",
      };
    } catch {
      throw new Error("Failed to retrieve access token.");
    }
  }
}
