import { redirect } from "react-router";
import type { Route } from "./+types/login-validate-otp";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const otp = url.searchParams.get("otp");
  if (!otp) {
    return { error: "Invalid OTP" };
  }

  // TODO: Validate OTP

  // If PW Reset then redirect to reset password
  if (url.searchParams.get("reset-password")) {
    return redirect("/auth/reset-password");
  }

  // Redirect to home
  return redirect("/");
}

export default function LoginValidateOtp({ loaderData }: Route.ComponentProps) {
  return <div>{loaderData?.error && <p>{loaderData.error}</p>}</div>;
}
