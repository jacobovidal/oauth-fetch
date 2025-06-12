import Logo from "@/assets/oauthlabs-logo.svg";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import PublicApiRequest from "@/components/PublicApiRequest/PublicApiRequest";
import BearerApiRequest from "@/components/BearerApiRequest/BearerApiRequest";
import DpopApiRequest from "@/components/DpopApiRequest/DpopApiRequest";
import { Button } from "./components/ui/button";

function Home() {
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
              Test public and protected APIs (
              <a
                className="underline hover:text-primary"
                rel="noopener noreferrer"
                href="https://www.npmjs.com/package/express-oauth2-dpop"
              >
                express-oauth2-dpop
              </a>
              ) using{" "}
              <a
                className="underline hover:text-primary"
                rel="noopener noreferrer"
                href="https://www.npmjs.com/package/oauth-fetch"
              >
                oauth-fetch
              </a>{" "}
              and see how it dynamically manages authentication based on the
              token type, while intelligently handling headers and parsing
              responses.
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild>
              <a
                href="https://github.com/jacobovidal/oauth-fetch/blob/main/packages/oauth-fetch/README.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
            </Button>
            <Button asChild variant="outline">
              <a
                href="https://github.com/jacobovidal/oauth-fetch/blob/main/packages/oauth-fetch/docs/README.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                API Reference
              </a>
            </Button>
          </div>
        </div>
      </section>
      <section className="py-12 px-6">
        <div className="mx-auto mt-5 max-w-2xl text-center">
          <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight">
            Use cases
          </h1>
          <div className="mx-auto mt-8 max-w-3xl text-left">
            <Tabs defaultValue="dpop">
              <TabsList className="grid grid-cols-1 h-auto md:grid-cols-3 mb-6 w-full max-w-2xl mx-auto">
                <TabsTrigger value="dpop">
                  Call protected API (DPoP)
                </TabsTrigger>
                <TabsTrigger value="bearer">
                  Call protected API (Bearer)
                </TabsTrigger>
                <TabsTrigger value="public">Call public API</TabsTrigger>
              </TabsList>
              <TabsContent value="dpop" className="w-full mx-auto">
                <p className="mb-6 text-muted-foreground">
                  oauth-fetch automatically creates a cryptographic key pair and
                  obtains a DPoP-bound access token for you. It handles the
                  generation of the proof header and manages DPoP nonces, so you
                  can seamlessly call protected APIs that require
                  proof-of-possession tokens.
                </p>
                <DpopApiRequest />
              </TabsContent>
              <TabsContent value="bearer" className="w-full mx-auto">
                <p className="mb-6 text-muted-foreground">
                  oauth-fetch automatically fetches a Bearer access token and
                  includes it in your request to the protected API. This lets
                  you easily call OAuth-secured endpoints that accept standard
                  Bearer tokens without extra setup.
                </p>
                <BearerApiRequest />
              </TabsContent>
              <TabsContent value="public" className="w-full mx-auto">
                <p className="mb-6 text-muted-foreground">
                  This option lets you make requests to public APIs that don't
                  require any authentication. Just send the request and get the
                  data automatically based on the response content type.
                </p>
                <PublicApiRequest />
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
