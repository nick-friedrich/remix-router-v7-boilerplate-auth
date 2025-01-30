import {
  Form,
  Link,
  useNavigation,
  type ActionFunctionArgs,
} from "react-router";
import { Button } from "~/components/common/button";
import Input from "~/components/common/input";
import { UserService } from "~/model/user.server";
import { redirect } from "react-router";
import type { Route } from "./+types/signup";
import { ZodError } from "zod";
import Alert from "~/components/common/alert";

type FieldErrors = {
  [key: string]: string;
};

export async function loader({ request }: Route.LoaderArgs) {
  const { isAuthenticated } = await UserService.checkServerSideAuth(request);
  if (isAuthenticated) {
    return redirect("/dashboard");
  }
  return { isAuthenticated };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  try {
    const user = await UserService.signUpWithPasswordAndEmail({
      email: email!,
      password: password!,
      confirmPassword: confirmPassword!,
    });
    // Redirect to login if email is not verified
    if (user.emailVerifiedAt === null) {
      return redirect("/login?showEmailSentMessage=true");
    } else {
      return redirect("/dashboard");
    }
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

// TODO: Integrate into UI
export default function Signup({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  return (
    <Form method="post">
      <div className="flex flex-col items-center  gap-4 my-12">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <div className="flex bg-base-100 p-8 rounded-xl flex-col  gap-4 min-w-[300px] shadow-sm">
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
            <Input
              label="Confirm Password"
              placeholder="Confirm Password"
              type="password"
              name="confirmPassword"
            />
            {actionData?.fieldErrors?.confirmPassword && (
              <div className="text-red-500 text-sm">
                {actionData.fieldErrors.confirmPassword}
              </div>
            )}
          </div>

          <Button
            disabled={navigation.state === "submitting"}
            variant="primary"
          >
            {navigation.state === "submitting" ? "Signing up..." : "Sign up"}
          </Button>
          <Link to={{ pathname: "/auth/login" }} className="text-sm">
            Already have an account? <b>Login</b>
          </Link>
        </div>
      </div>
    </Form>
  );
}
