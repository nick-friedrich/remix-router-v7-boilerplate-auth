import { UserService } from "~/model/user.server";
import type { Route } from "./+types/logout";
import { redirect } from "react-router";

export async function action({ request }: Route.ActionArgs) {
  await UserService.logout(request);
  // Return response with cleared session cookie
  return redirect("/auth/login");
}
