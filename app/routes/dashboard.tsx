import { useAuth } from "~/components/provider/auth-provider";
import type { Route } from "./+types/dashboard";
import { redirect } from "react-router";
import { UserService } from "~/model/user.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { isAuthenticated, user } = await UserService.checkServerSideAuth(
    request
  );
  if (!isAuthenticated) {
    return redirect("/auth/login");
  }
  return { isAuthenticated, user };
}
export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {loaderData?.user?.email}</p>
    </div>
  );
}
