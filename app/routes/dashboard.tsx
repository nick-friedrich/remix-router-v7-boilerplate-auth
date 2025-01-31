import { useAuth } from "~/components/provider/auth-provider";
import type { Route } from "./+types/dashboard";
import { redirect } from "react-router";
import { UserService } from "~/model/user.server";
import Alert from "~/components/common/alert";

export async function loader({ request }: Route.LoaderArgs) {
  const { isAuthenticated, user } = await UserService.checkServerSideAuth(
    request
  );
  if (!isAuthenticated) {
    return redirect("/auth/login");
  }

  const url = new URL(request.url);
  const emailVerified = url.searchParams.get("emailVerified") === "true";
  return { isAuthenticated, user, emailVerified };
}
export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Dashboard</h1>
      {loaderData?.emailVerified && (
        <Alert
          message="You have verified your email address"
          variant="success-soft"
        />
      )}
      <p>Welcome, {loaderData?.user?.email}</p>
    </div>
  );
}
