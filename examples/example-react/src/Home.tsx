import { DPoPUtils, OAuthFetch } from "oauth-fetch";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";

import Logo from "@/assets/oauthlabs-logo.svg";
import { Button } from "@/components/ui/button";
import { Auth0TokenProvider } from "@/utils/auth0-token-provider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CodeBlock from "@/components/CodeBlock/CodeBlock";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DuendeTokenProvider } from "@/utils/duende-token-provider";
import { Separator } from "@/components/ui/separator";
import {
  publicClientSnippet,
  bearerClientSnippet,
  dpopClientSnippet,
} from "@/utils/code-snippets";

const dpopKeyPair = await DPoPUtils.generateKeyPair({
  algorithm: "ECDSA",
  curveOrModulus: "P-384",
});

function Home() {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  const publicClient = new OAuthFetch({
    baseUrl: "https://jsonplaceholder.typicode.com",
    isProtected: false,
  });

  const bearerClient = new OAuthFetch({
    baseUrl: "https://auth0.oauthlabs.com",
    tokenProvider: new Auth0TokenProvider(useAuth0()),
  });

  const dpopClient = new OAuthFetch({
    baseUrl: "https://dpoptestapi.azurewebsites.net",
    tokenProvider: new DuendeTokenProvider(dpopKeyPair),
    dpopKeyPair,
  });

  const handlePublicRequest = async () => {
    try {
      await publicClient.get("/posts/1");
      toast.success("Public resource fetched successfully.");
    } catch {
      toast.error("Error fetching public resource");
    }
  };

  const handleBearerRequest = async () => {
    if (!isAuthenticated) {
      toast.error("You need to authenticate to fetch this resource");
      return;
    }

    try {
      await bearerClient.get("/userinfo");
      toast.success("Private resource (Bearer) fetched successfully.");
    } catch {
      toast.error("Error fetching private resource");
    }
  };

  const handleDpopRequest = async () => {
    try {
      await dpopClient.get("/DPoP");
      toast.success("Private resource (DPoP) fetched successfully.");
    } catch {
      toast.error("Error fetching private resource");
    }
  };

  const handleLogin = async () => {
    await loginWithRedirect();
  };

  const handleSignup = async () => {
    await loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  };

  const handleLogout = async () => {
    await logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <>
      <section className="py-12 px-6">
        <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
          <div className="mx-auto mt-5 max-w-2xl text-center flex flex-col items-center">
            <img src={Logo} className="w-18 mb-6" />
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              oauth-fetch playground
            </h1>
          </div>
          <div className="mx-auto mt-5 max-w-3xl text-center">
            <p className="text-muted-foreground text-xl max-w-150 mx-auto">
              Test public and protected APIs with oauth-fetch and see how it
              dynamically manages authentication based on the token type, while
              intelligently handling headers and parsing responses.
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-3">
            {!isAuthenticated && (
              <>
                <Button onClick={handleLogin}>Log in</Button>
                <Button variant="outline" onClick={handleSignup}>
                  Sign up
                </Button>
              </>
            )}
            {isAuthenticated && (
              <Button variant="destructive" onClick={handleLogout}>
                Log out
              </Button>
            )}
          </div>
        </div>
      </section>
      <section className="py-12 px-6">
        <div className="mx-auto mt-5 max-w-2xl text-center">
          <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight">
            Use cases
          </h1>
          <div className="mx-auto mt-8 max-w-3xl text-left">
            <Tabs defaultValue="public">
              <TabsList className="grid grid-cols-1 h-auto md:grid-cols-3 mb-12 w-full max-w-2xl mx-auto">
                <TabsTrigger value="public">Call public API</TabsTrigger>
                <TabsTrigger value="bearer">
                  Call protected API (Bearer)
                </TabsTrigger>
                <TabsTrigger value="dpop">
                  Call protected API (DPoP)
                </TabsTrigger>
              </TabsList>
              <TabsContent value="public" className="w-full mx-auto">
                <Card>
                  <CardContent>
                    <CodeBlock lang="javascript" code={publicClientSnippet} />
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handlePublicRequest}>Request</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="bearer" className="w-full mx-auto">
                <Card>
                  <CardContent>
                    <CodeBlock lang="javascript" code={bearerClientSnippet} />
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleBearerRequest}>Request</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="dpop" className="w-full mx-auto">
                <Card>
                  <CardContent>
                    <CodeBlock lang="javascript" code={dpopClientSnippet} />
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleDpopRequest}>Request</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      <Separator className="mt-12" />
      <div className="py-8 flex items-center justify-center text-muted-foreground text-sm">
        <span>Crafted by</span>
        <a
          className="underline ml-1 hover:text-primary"
          rel="noopener noreferrer"
          href="https://www.jacobovidal.com/"
        >
          Jacobo Vidal
        </a>
      </div>
    </>
  );
}

export default Home;
