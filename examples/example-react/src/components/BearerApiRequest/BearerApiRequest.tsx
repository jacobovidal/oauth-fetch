import { OAuthFetch } from "oauth-fetch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import CodeBlock from "@/components/CodeBlock/CodeBlock";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { bearerClientSnippet } from "@/utils/code-snippets";
import { useState } from "react";
import { DuendeBearerTokenProvider } from "@/token-providers/duende-bearer-token-provider";

function BearerApiRequest() {
  const [isLoading, setIsLoading] = useState(false);

  const client = new OAuthFetch({
    baseUrl: "https://demo.duendesoftware.com",
    tokenProvider: new DuendeBearerTokenProvider(),
  });

  const handleRequest = async () => {
    setIsLoading(true);

    try {
      await client.get("/api/test");

      toast.success("Private resource (Bearer) fetched successfully");

      setIsLoading(false);
    } catch {
      toast.error("Error fetching private resource");

      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <CodeBlock lang="javascript" code={bearerClientSnippet} />
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

export default BearerApiRequest;
