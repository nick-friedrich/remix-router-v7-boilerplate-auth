import { Link } from "react-router";
import { useAuth } from "../provider/auth-provider";
import { Button } from "../common/button";
import { UserCircle, UserIcon } from "lucide-react";

interface Navigation {
  name: string;
  href?: string; // Only works when children is undefined
  children?: Navigation[];
}

const navigationMenu: Navigation[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  {
    name: "Products",
    children: [
      { name: "Product 1", href: "/products/1" },
      { name: "Product 2", href: "/products/2" },
    ],
  },
];

export function MobileMenu({ navigation }: { navigation: Navigation[] }) {
  const handleClick = () => {
    const elem = document.activeElement;
    if (elem) {
      (elem as HTMLElement).blur();
    }
  };
  return (
    <ul
      tabIndex={0}
      className="menu menu-sm dropdown-content bg-base-200 border border-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow"
    >
      {navigation.map((item, index) => (
        <li key={index}>
          <Link
            to={{ pathname: item.children ? undefined : item.href }}
            onClick={handleClick}
          >
            {item.name}
          </Link>
          {item.children && (
            <ul className="p-2">
              {item.children.map((child, childIndex) => (
                <li key={childIndex}>
                  <Link to={{ pathname: child.href }} onClick={handleClick}>
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export function DesktopMenu({ navigation }: { navigation: Navigation[] }) {
  return (
    <ul className="menu menu-horizontal px-1">
      {navigation.map((item, index) => (
        <li key={index}>
          {item.children ? (
            <details>
              <summary>{item.name}</summary>
              <ul className="bg-base-200 border border-base-300 rounded-box z-1 mt-3 w-52 shadow">
                {item.children.map((child, childIndex) => (
                  <li key={childIndex}>
                    <Link to={{ pathname: child.href }}>{child.name}</Link>
                  </li>
                ))}
              </ul>
            </details>
          ) : (
            <Link to={{ pathname: item.href }}>{item.name}</Link>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleClick = () => {
    const elem = document.activeElement;
    if (elem) {
      (elem as HTMLElement).blur();
    }
  };

  const handleLogout = () => {
    logout();
    handleClick();
  };

  return (
    <div className="navbar bg-base-100 rounded-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <MobileMenu navigation={navigationMenu} />
        </div>
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <DesktopMenu navigation={navigationMenu} />
      </div>
      <div className="navbar-end">
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-8 rounded-full bg-base-300">
                <div className="flex items-center justify-center w-full h-full">
                  <UserIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-200 border border-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <span>
                  Welcome {user?.name != null ? user.name : user?.email}
                </span>
              </li>

              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        ) : (
          <Button asAnchor href="/auth/login" onClick={handleClick}>
            Login
          </Button>
        )}
      </div>
    </div>
  );
}
