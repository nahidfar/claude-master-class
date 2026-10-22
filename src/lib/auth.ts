export class AuthenticationNotImplementedError extends Error {
  constructor() {
    super("Authentication is not implemented yet. Follow the instructor's guidance during class. Private access remains blocked.");
    this.name = "AuthenticationNotImplementedError";
  }
}

export function authConfiguration(): { password: string; secret: string } {
  throw new AuthenticationNotImplementedError();
}

export async function isAuthenticated(): Promise<boolean> {
  throw new AuthenticationNotImplementedError();
}
