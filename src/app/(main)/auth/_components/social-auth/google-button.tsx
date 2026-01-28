"use client";

import { siGoogle } from "simple-icons";
import { createClient } from "@/lib/supabase/client";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GoogleButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  const handleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Button variant="secondary" className={cn(className)} onClick={handleLogin} {...props}>
      <SimpleIcon icon={siGoogle} className="size-4" />
      Continuar con Google
    </Button>
  );
}
