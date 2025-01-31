import { redirect } from "react-router";
import type { Route } from "./+types/login-validate-otp";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  // Special cases for reset password and verify mail
  const resetPassword = url.searchParams.get("resetPassword") === "true";
  const verifyMail = url.searchParams.get("verifyMail") === "true";
  if (!token) {
    return { error: "Invalid token" };
  }

  // TODO: Validate OTP

  // If PW Reset then redirect to reset password
  if (resetPassword) {
    return redirect("/auth/reset-password");
  }

  // If verify mail then redirect to dashboard with success message
  if (verifyMail) {
    return redirect("/dashboard?emailVerified=true");
  }

  // Redirect to home
  return redirect("/dashboard");
}

export default function LoginValidateOtp({ loaderData }: Route.ComponentProps) {
  return <div>{loaderData?.error && <p>{loaderData.error}</p>}</div>;
}
