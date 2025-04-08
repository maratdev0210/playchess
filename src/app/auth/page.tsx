// Signup page

import AuthForm from "../ui/auth/AuthForm";

export default function Page() {
  return (
    <>
      <AuthForm
        authText="Create an account and start playing chess!"
        authAlternative="login"
        authAlternativeText="Already have an account?"
        authType="signup"
      />
    </>
  );
}
