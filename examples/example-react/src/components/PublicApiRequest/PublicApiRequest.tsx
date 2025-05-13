import { useState } from "react";
import { OAuthFetch } from "oauth-fetch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import CodeBlock from "@/components/CodeBlock/CodeBlock";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  publicClientSnippet,
} from "@/utils/code-snippets";

function PublicApiRequest() {
  const [ isLoading, setIsLoading ] = useState(false);

  const client = new OAuthFetch({
    baseUrl: "https://jsonplaceholder.typicode.com",
    isProtected: false,
  });

  const handleRequest = async () => {
    setIsLoading(true);

    try {
      await client.get("/posts/1");

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
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Request
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PublicApiRequest;
