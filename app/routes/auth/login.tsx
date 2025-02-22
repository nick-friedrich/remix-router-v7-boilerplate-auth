import { Form, Link, useNavigation } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { Button } from "~/components/common/button";
import Input from "~/components/common/input";
import { UserService } from "~/model/user.server";
import { ZodError } from "zod";
import type { Route } from "./+types/login";
import Alert from "~/components/common/alert";
import { redirect } from "react-router";

type FieldErrors = {
  [key: string]: string;
};

export async function loader({ request }: Route.LoaderArgs) {
  const { isAuthenticated } = await UserService.checkServerSideAuth(request);
  if (isAuthenticated) {
    return redirect("/dashboard");
  }
  const url = new URL(request.url);
  // If we signed up we redirect to the login page with a message
  const showEmailSentMessage = url.searchParams.get("showEmailSentMessage");
  if (showEmailSentMessage) {
    return { showEmailSentMessage };
  }
  // Unnecessary but let's keep it for now
  return { isAuthenticated };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  try {
    const { user, headers } = await UserService.signInWithPasswordAndEmail({
      email: email!,
      password: password!,
    });

    return redirect("/dashboard", { headers });
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: FieldErrors = error.errors.reduce((acc, curr) => {
        return { ...acc, [curr.path.join(".")]: curr.message };
      }, {});
      return { fieldErrors };
    }
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export default function Login({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const navigation = useNavigation();

  return (
    <Form method="post">
      <div className="flex flex-col items-center gap-4 my-12">
        <h1 className="text-2xl font-bold">Login</h1>
        <div className="flex bg-base-100 p-8 rounded-xl flex-col  gap-4 w-[350px] shadow-sm">
          {actionData?.error && (
            <Alert variant="error-soft" message={actionData.error} />
          )}
          {loaderData?.showEmailSentMessage && (
            <Alert
              variant="success-soft"
              message="Please check your email for a link to verify your email address."
            />
          )}
          <div className="flex flex-col gap-1">
            <Input
              label="E-Mail"
              placeholder="E-Mail"
              type="email"
              name="email"
            />
            {actionData?.fieldErrors?.email && (
              <div className="text-red-500 text-sm">
                {actionData.fieldErrors.email}
              </div>
            )}
            <Input
              label="Password"
              placeholder="Password"
              type="password"
              name="password"
            />
            {actionData?.fieldErrors?.password && (
              <div className="text-red-500 text-sm">
                {actionData.fieldErrors.password}
              </div>
            )}
          </div>
          <Button
            variant="primary"
            disabled={navigation.state === "submitting"}
          >
            {navigation.state === "submitting" ? "Logging in..." : "Login"}
          </Button>
          <Button variant="secondary" asAnchor href="/auth/login/otp">
            Login via Magic Link
          </Button>
          <Link to={{ pathname: "/auth/signup" }} className="text-sm">
            Don't have an account? <b>Sign up</b>
          </Link>
          <Link to={{ pathname: "/auth/forgot-password" }} className="text-sm">
            Forgot password?
          </Link>
        </div>
      </div>
    </Form>
  );
}
