import {
  AbstractTokenProvider,
  type TokenProviderGetTokenResponse,
} from "oauth-fetch";
import { useAuth } from "@workos-inc/authkit-react";

export class WorkOSTokenProvider extends AbstractTokenProvider {
  private workos;

  constructor(workos: typeof useAuth) {
    super();
    this.workos = workos();
  }

  async getToken(): Promise<TokenProviderGetTokenResponse> {
    try {
      const accessToken = await this.workos.getAccessToken();

      return {
        access_token: accessToken,
        token_type: "Bearer",
      };
    } catch {
      throw new Error("Failed to retrieve access token.");
    }
  }
}
