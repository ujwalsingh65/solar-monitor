import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { Sun } from "lucide-react";

export default function Auth() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-secondary shadow-glow">
          <Sun className="h-6 w-6 text-secondary-foreground" />
        </div>
        <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
          Sun Peek Insight
        </span>
      </div>

      {mode === "sign-in" ? (
        <SignIn
          routing="path"
          path="/auth"
          signUpUrl="/auth?mode=sign-up"
          fallbackRedirectUrl="/"
          appearance={{
            elements: {
              rootBox: "w-full max-w-md",
              card: "shadow-card border border-border rounded-xl",
            },
          }}
        />
      ) : (
        <SignUp
          routing="path"
          path="/auth"
          signInUrl="/auth"
          fallbackRedirectUrl="/"
          appearance={{
            elements: {
              rootBox: "w-full max-w-md",
              card: "shadow-card border border-border rounded-xl",
            },
          }}
        />
      )}

      <div className="mt-4 text-center text-sm">
        <button
          type="button"
          onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
          className="text-primary hover:underline"
        >
          {mode === "sign-in"
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
