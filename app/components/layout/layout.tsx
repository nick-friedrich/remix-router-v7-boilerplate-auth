import { Outlet } from "react-router";
import Header from "./header";
import Footer from "./footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="m-2">
        <Header />
      </div>
      <div className="flex-grow p-4">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
