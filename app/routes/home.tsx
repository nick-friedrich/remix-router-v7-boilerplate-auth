import { useSite } from "~/components/provider/site-provider";
import type { Route } from "./+types/home";
import { Mail } from "~/lib/mail.server";

export function meta({}: Route.MetaArgs) {
  const { appName } = useSite();
  return [
    { title: appName + " - Home" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  return {
    message: "Hello World",
  };
}

export default function Home() {
  return <div>Home</div>;
}
