import { redirect } from "next/navigation";
import { AuthenticationNotImplementedError, authConfiguration, isAuthenticated } from "./auth";

export async function privatePageGuard() {
  let authenticated: boolean;
  try {
    authConfiguration();
    authenticated = await isAuthenticated();
  } catch (error) {
    if (error instanceof AuthenticationNotImplementedError) {
      return <main id="main" className="workspace"><h1>Build authentication first</h1><p className="error" role="alert">{error.message}</p></main>;
    }
    console.error("Private page configuration error:", error);
    return <main id="main" className="workspace"><h1>Configure your private workspace</h1><p className="error" role="alert">Set SITE_PASSWORD (12+ characters) and SESSION_SECRET (32+ characters) in .env.local, then restart. The public portfolio does not need these values.</p></main>;
  }
  if (!authenticated) redirect("/login");
  return null;
}
