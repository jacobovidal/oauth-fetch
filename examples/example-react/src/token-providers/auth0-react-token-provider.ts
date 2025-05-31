import { AbstractTokenProvider, SUPPORTED_TOKEN_TYPES } from "oauth-fetch";
import type {
  Auth0ContextInterface,
  GetTokenSilentlyOptions,
} from "@auth0/auth0-react";
import type { TokenProviderGetTokenResponse } from "oauth-fetch";

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
        token_type: SUPPORTED_TOKEN_TYPES.BEARER,
      };
    } catch {
      throw new Error("Failed to retrieve access token.");
    }
  }
}
