export class AuthenticationNotImplementedError extends Error {
  constructor() {
    super("Authentication is not implemented yet. Complete exercises/00-authentication.md. Private access remains blocked.");
    this.name = "AuthenticationNotImplementedError";
  }
}

export function authConfiguration(): { password: string; secret: string } {
  throw new AuthenticationNotImplementedError();
}

export async function isAuthenticated(): Promise<boolean> {
  throw new AuthenticationNotImplementedError();
}
