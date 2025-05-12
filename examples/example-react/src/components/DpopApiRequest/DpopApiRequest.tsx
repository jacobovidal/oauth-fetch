import { DPoPUtils, OAuthFetch } from "oauth-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import CodeBlock from "@/components/CodeBlock/CodeBlock";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  publicClientSnippet,
} from "@/utils/code-snippets";
import { DuendeTokenProvider } from "@/utils/duende-token-provider";

function DpopApiRequest() {
  const handleRequest = async () => {
    const dpopKeyPair = await DPoPUtils.generateKeyPair({
      algorithm: "ECDSA",
      curveOrModulus: "P-384",
    });
  
    const client = new OAuthFetch({
      baseUrl: "https://dpoptestapi.azurewebsites.net",
      tokenProvider: new DuendeTokenProvider(dpopKeyPair),
      dpopKeyPair,
    });

    try {
      await client.get("/DPoP");
      toast.success("Private resource (DPoP) fetched successfully.");
    } catch {
      toast.error("Error fetching private resource");
    }
  };

  return (
    <Card>
      <CardContent>
        <CodeBlock lang="javascript" code={publicClientSnippet} />
      </CardContent>
      <CardFooter>
        <Button onClick={handleRequest}>Request</Button>
      </CardFooter>
    </Card>
  );
}

export default DpopApiRequest;
