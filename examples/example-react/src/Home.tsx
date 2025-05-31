import Logo from "@/assets/oauthlabs-logo.svg";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import PublicApiRequest from "@/components/PublicApiRequest/PublicApiRequest";
import BearerApiRequest from "@/components/BearerApiRequest/BearerApiRequest";
import DpopApiRequest from "@/components/DpopApiRequest/DpopApiRequest";

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
              Test public and protected APIs with oauth-fetch and see how it
              dynamically manages authentication based on the token type, while
              intelligently handling headers and parsing responses.
            </p>
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
                <PublicApiRequest />
              </TabsContent>
              <TabsContent value="bearer" className="w-full mx-auto">
                <BearerApiRequest />
              </TabsContent>
              <TabsContent value="dpop" className="w-full mx-auto">
                <DpopApiRequest />
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
