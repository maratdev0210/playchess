export type AuthType = "signup" | "login";

type AuthTypeErrors = {
  [authType in AuthType]: string;
};

interface AuthErrors {
  [key: string]: AuthTypeErrors;
}

export const AUTH_ERRORS: AuthErrors = {
  username: {
    login: "Incorrect username or password",
    signup: "Username must be at least 2 characters",
  },
  password: {
    login: "Incorrect username or password",
    signup: "Password must contain at least 8 characters",
  },
};

// links for alternative method of authentication
// Example: when the user is on auth/signup offer the user to auth/login (redirecting him)
interface AuthAlternativeLinks {
  [key: string]: string;
}

export const AUTH_ALTERNATIVE_LINKS: AuthAlternativeLinks = {
  signup: "/auth",
  login: "/auth/login",
};

export type FormField = "username" | "password";

export const FORM_FIELDS: FormField[] = ["username", "password"];
