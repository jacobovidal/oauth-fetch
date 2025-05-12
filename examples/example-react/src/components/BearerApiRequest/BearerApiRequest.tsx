import { OAuthFetch } from "oauth-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import CodeBlock from "@/components/CodeBlock/CodeBlock";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  publicClientSnippet,
} from "@/utils/code-snippets";
import { Auth0TokenProvider } from "@/utils/auth0-token-provider";
import { useAuth0 } from "@auth0/auth0-react";

function BearerApiRequest() {
  const { isAuthenticated } = useAuth0();
  const auth0 = useAuth0();

  const client = new OAuthFetch({
    baseUrl: "https://auth0.oauthlabs.com",
    tokenProvider: new Auth0TokenProvider(auth0),
  });

  const handleRequest = async () => {
    if (!isAuthenticated) {
      toast.error("You need to authenticate to fetch this resource");
      return;
    }

    try {
      await client.get("/userinfo");
      toast.success("Private resource (Bearer) fetched successfully.");
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

export default BearerApiRequest;
