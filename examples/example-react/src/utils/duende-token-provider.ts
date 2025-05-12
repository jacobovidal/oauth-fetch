import { AbstractTokenProvider, DPoPUtils, OAuthFetch } from "oauth-fetch";

export interface TokenResponse {
  access_token: string;
  token_type: "Bearer" | "DPoP";
}

export interface DPoPKeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

export class DuendeTokenProvider extends AbstractTokenProvider {
  private tokenSet?: TokenResponse;
  private client: OAuthFetch;
  private dpopKeyPair: DPoPKeyPair;

  constructor(dpopKeyPair: DPoPKeyPair) {
    super();
    this.dpopKeyPair = dpopKeyPair;
    this.client = new OAuthFetch({
      baseUrl: "https://dpopidentityserver.azurewebsites.net",
      isProtected: false,
      contentType: "formUrlEncoded",
    });
  }

  async getToken(): Promise<TokenResponse> {
    if (this.tokenSet) {
      return this.tokenSet;
    }

    const dpopProof = await DPoPUtils.generateProof({
      url: new URL(
        "https://dpopidentityserver.azurewebsites.net/connect/token"
      ),
      method: "POST",
      dpopKeyPair: this.dpopKeyPair,
    });

    try {
      const { access_token } = (await this.client.post(
        "/connect/token",
        {
          client_id: "client",
          grant_type: "client_credentials",
        },
        {
          extraHeaders: {
            DPoP: dpopProof,
          },
        }
      )) as TokenResponse;

      this.tokenSet = { access_token, token_type: "DPoP" };

      return this.tokenSet;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve token: ${error.message}`);
      }

      throw new Error(`Failed to retrieve token: ${String(error)}`);
    }
  }
}
