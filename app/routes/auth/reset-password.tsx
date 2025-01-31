import { ArrowLeft } from "lucide-react";
import { Form, Link, redirect, useNavigation } from "react-router";
import { Button } from "~/components/common/button";
import Input from "~/components/common/input";
import type { Route } from "./+types/reset-password";
import { UserService } from "~/model/user.server";
import Alert from "~/components/common/alert";

export async function loader({ request }: Route.LoaderArgs) {
  const { isAuthenticated } = await UserService.checkServerSideAuth(request);
  if (!isAuthenticated) {
    return redirect("/auth/login");
  }
}

export async function action({ request }: Route.ActionArgs) {
  const { user } = await UserService.checkServerSideAuth(request);
  const formData = await request.formData();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  if (!password || !confirmPassword) {
    return { error: "Please fill all the fields" };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }
  if (!user) {
    return redirect("/auth/login");
  }
  try {
    await UserService.resetPassword(password!, confirmPassword!, user.id);
  } catch (e) {
    return { error: "Something went wrong" };
  }

  return { success: true };
}

export default function ResetPassword({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  return (
    <Form method="post">
      <div className="flex flex-col items-center  gap-4 my-12">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <div className="flex bg-base-100 p-8 rounded-xl flex-col  gap-4 min-w-[300px] shadow-sm">
          {actionData?.error && (
            <Alert variant="error-soft" message={actionData.error} />
          )}
          {actionData?.success && (
            <Alert
              variant="success-soft"
              message="Password changed successfully"
            />
          )}
          <Link
            to={{ pathname: "/dashboard" }}
            className="text-sm flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to <b>Dashboard</b>
          </Link>
          <div className="flex flex-col gap-1">
            <Input
              label="New Password"
              placeholder="New Password"
              type="password"
              name="password"
              disabled={actionData?.success}
            />
            <Input
              label="Confirm Password"
              placeholder="Confirm Password"
              type="password"
              name="confirmPassword"
              disabled={
                actionData?.success || navigation.state === "submitting"
              }
            />
          </div>
          <Button
            variant="primary"
            disabled={actionData?.success || navigation.state === "submitting"}
          >
            Reset password
          </Button>
        </div>
      </div>
    </Form>
  );
}
