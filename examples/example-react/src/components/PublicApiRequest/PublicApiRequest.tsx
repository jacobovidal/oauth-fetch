import { OAuthFetch } from "oauth-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import CodeBlock from "@/components/CodeBlock/CodeBlock";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  publicClientSnippet,
} from "@/utils/code-snippets";

function PublicApiRequest() {
  const client = new OAuthFetch({
    baseUrl: "https://jsonplaceholder.typicode.com",
    isProtected: false,
  });

  const handleRequest = async () => {
    try {
      await client.get("/posts/1");
      toast.success("Public resource fetched successfully.");
    } catch {
      toast.error("Error fetching public resource");
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

export default PublicApiRequest;
