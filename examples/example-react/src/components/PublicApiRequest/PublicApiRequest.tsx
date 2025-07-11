import { useEffect, useState } from "react";
import { OAuthFetch } from "oauth-fetch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import CodeBlock from "@/components/CodeBlock/CodeBlock";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { publicClientSnippet } from "@/utils/code-snippets";

function PublicApiRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState<OAuthFetch | null>(null);

  useEffect(() => {
    const initOauthFetchClient = async () => {
      const client = new OAuthFetch({
        baseUrl: "https://api.playground.oauthlabs.com",
        isProtected: false,
      });

      setClient(client);
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
      await client.get("/public/hello");

      toast.success("Public resource fetched successfully");

      setIsLoading(false);
    } catch {
      toast.error("Error fetching public resource");

      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <CodeBlock lang="javascript" code={publicClientSnippet} />
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

export default PublicApiRequest;
