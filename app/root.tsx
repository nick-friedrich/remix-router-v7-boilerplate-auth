import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import { SiteProvider, useSite } from "./components/provider/site-provider";

/*
 * Loader
 *
 * This is the loader for the root route.
 * It is used to pass the appName and baseUrl to the SiteProvider.
 */

export function loader() {
  const appName = process.env.APP_NAME;
  const baseUrl = process.env.APP_URL;

  return { appName, baseUrl };
}

/*
 * Meta
 *
 * This is the meta function for the root route.
 * It is used to set the title and description for the page.
 */
export function meta() {
  const { appName } = useSite();
  return [
    { title: appName },
    {
      property: "og:title",
      content: "My App",
    },
    {
      name: "description",
      content: "My App",
    },
  ];
}

/*
 * Links
 *
 * This is the links function for the root route.
 * It is used to add the preconnect and stylesheet links to the page.
 */
export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

/*
 * App
 *
 * This is the main component for the root route.
 * It is used to wrap the app in the SiteProvider and provide the loader data.
 */
export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <SiteProvider
      appName={loaderData?.appName || ""}
      baseUrl={loaderData?.baseUrl || ""}
    >
      <html lang="en" data-theme="winter">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <div className="flex flex-col min-h-screen">
            <div className="m-2">
              <Header />
            </div>
            <div className="flex-grow p-4">
              <Outlet />
            </div>

            <Footer />
          </div>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </SiteProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
