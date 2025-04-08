import AuthForm from "../../ui/auth/AuthForm";

export default function Page() {
  return (
    <>
      <AuthForm
        authText="Log into your account"
        authAlternative="signup"
        authAlternativeText="Do not have an account yet?"
        authType="login"
      />
    </>
  );
}
