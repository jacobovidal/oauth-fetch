import { type Auth0ContextInterface, type GetTokenSilentlyOptions } from "@auth0/auth0-react";
import { AbstractTokenProvider, type TokenProviderGetTokenResponse } from "oauth-fetch";

export class Auth0TokenProvider extends AbstractTokenProvider {
  private auth0: Auth0ContextInterface;

  constructor(auth0: Auth0ContextInterface) {
    super();
    this.auth0 = auth0;
  }

  async getToken(options?: GetTokenSilentlyOptions): Promise<TokenProviderGetTokenResponse> {
    try {
      const accessToken = await this.auth0.getAccessTokenSilently(options);

      return {
        access_token: accessToken,
        token_type: "Bearer",
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve token: ${error.message}`);
      }

      throw new Error(`Failed to retrieve token: ${String(error)}`);
    }
  }
}
