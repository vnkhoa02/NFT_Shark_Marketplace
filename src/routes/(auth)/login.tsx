import { createFileRoute } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import authClient from "~/lib/auth-client";

export const Route = createFileRoute("/(auth)/login")({
  component: LoginForm,
});

function LoginForm() {
  const { redirectUrl } = Route.useRouteContext();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <a href="#" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-6" />
            </div>
            <span className="sr-only">NFT Shark.</span>
          </a>
          <h1 className="text-xl font-bold">Login to NFT Shark.</h1>
        </div>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          {errorMessage && (
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              {errorMessage}
            </span>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-1">
          <Button
            variant="outline"
            className="w-full"
            type="button"
            disabled={isLoading}
            onClick={() =>
              authClient.signIn.social(
                {
                  provider: "google",
                  callbackURL: redirectUrl,
                },
                {
                  onRequest: () => {
                    setIsLoading(true);
                    setErrorMessage("");
                  },
                  onError: (ctx) => {
                    setIsLoading(false);
                    setErrorMessage(ctx.error.message);
                  },
                },
              )
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Login with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
