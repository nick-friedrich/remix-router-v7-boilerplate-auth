import { Form, Link, redirect, useNavigation } from "react-router";
import { Button } from "~/components/common/button";
import Input from "~/components/common/input";
import { UserService } from "~/model/user.server";
import type { Route } from "./+types/login-otp";
import { z } from "zod";
import Alert from "~/components/common/alert";

export async function loader({ request }: Route.LoaderArgs) {
  const { isAuthenticated } = await UserService.checkServerSideAuth(request);
  if (isAuthenticated) {
    return redirect("/dashboard");
  }

  // Unnecessary but let's keep it for now
  return { isAuthenticated };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const validatedEmail = z.string().email().safeParse(email);
  if (!validatedEmail.success) {
    return { error: "Invalid email" };
  }
  try {
    const success = await UserService.signInWithOtp({
      email: validatedEmail.data!,
    });
    if (!success) {
      return { error: "Something went wrong" };
    } else {
      return { success: true };
    }
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export default function LoginWithOTP({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  return (
    <Form method="post">
      <div className="flex flex-col items-center  gap-4 my-12">
        <h1 className="text-2xl font-bold">Login with OTP</h1>
        <div className="flex bg-base-100 p-8 rounded-xl flex-col  gap-4 w-[350px] shadow-sm">
          {actionData?.success && (
            <Alert
              variant="success-soft"
              message="Please check your email for a link to login."
            />
          )}
          {actionData?.error && (
            <Alert variant="error-soft" message={actionData.error} />
          )}
          <div className="flex flex-col gap-1">
            <Input
              label="E-Mail"
              placeholder="E-Mail"
              type="text"
              name="email"
            />
          </div>
          <Button
            variant="primary"
            disabled={navigation.state === "submitting"}
          >
            {navigation.state === "submitting"
              ? "Sending..."
              : "Send Magic Link"}
          </Button>
          <Button variant="secondary" asAnchor href="/auth/login">
            Login with password
          </Button>
          <Link to={{ pathname: "/auth/signup" }} className="text-sm">
            Don't have an account? <b>Sign up</b>
          </Link>
        </div>
      </div>
    </Form>
  );
}
