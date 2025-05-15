import { OAuthFetch } from "oauth-fetch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import CodeBlock from "@/components/CodeBlock/CodeBlock";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { bearerClientSnippet } from "@/utils/code-snippets";
import { Auth0TokenProvider } from "@/token-providers/auth0-react-token-provider";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

function BearerApiRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth0();
  const auth0 = useAuth0();

  const client = new OAuthFetch({
    baseUrl: "https://auth0.oauthlabs.com",
    tokenProvider: new Auth0TokenProvider(auth0),
  });

  const handleRequest = async () => {
    setIsLoading(true);

    if (!isAuthenticated) {
      toast.error("You need to authenticate to fetch this resource");

      setIsLoading(false);

      return;
    }

    try {
      await client.get("/userinfo");

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
