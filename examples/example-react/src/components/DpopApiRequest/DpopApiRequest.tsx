import { useEffect, useState } from "react";
import { DPoPUtils, OAuthFetch } from "oauth-fetch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import CodeBlock from "@/components/CodeBlock/CodeBlock";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { dpopClientSnippet } from "@/utils/code-snippets";
import { DuendeTokenProvider } from "@/utils/duende-token-provider";

function DpopApiRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState<OAuthFetch | null>(null);

  useEffect(() => {
    const initOauthFetchClient = async () => {
      const keyPair = await DPoPUtils.generateKeyPair({
        algorithm: "ECDSA",
        curveOrModulus: "P-384",
      });

      const oauthClient = new OAuthFetch({
        baseUrl: "https://dpoptestapi.azurewebsites.net",
        tokenProvider: new DuendeTokenProvider(keyPair),
        dpopKeyPair: keyPair,
      });

      setClient(oauthClient);
    };

    initOauthFetchClient();
  }, []);

  const handleRequest = async () => {
    if (!client) {
      toast.error("OAuthFetch client is not initialized");
      return;
    }

    setIsLoading(true);

    try {
      await client.get("/DPoP");
      toast.success("Private resource (DPoP) fetched successfully");
      setIsLoading(false);
    } catch {
      toast.error("Error fetching private resource");
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <CodeBlock lang="javascript" code={dpopClientSnippet} />
      </CardContent>
      <CardFooter>
        <Button onClick={handleRequest} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Request
        </Button>
      </CardFooter>
    </Card>
  );
}

export default DpopApiRequest;
