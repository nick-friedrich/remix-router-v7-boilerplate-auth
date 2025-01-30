import { Link } from "react-router";

export default function Login() {
  return (
    <div className="flex flex-col items-center  gap-4 my-12 shadow">
      <h1 className="text-2xl font-bold">Login</h1>
      <div className="flex bg-base-100 p-8 rounded-xl flex-col  gap-4 min-w-[300px]">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-sm text-base-content opacity-50"
          >
            E-Mail
          </label>
          <input
            id="email"
            type="text"
            name="email"
            placeholder="E-Mail"
            className="input input-bordered"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm text-base-content opacity-50"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            className="input input-bordered"
          />
        </div>
        <button className="btn btn-primary ">Login</button>
        <Link to={{ pathname: "/auth/signup" }} className="text-sm">
          Don't have an account? Sign up
        </Link>
        <Link to={{ pathname: "/auth/forgot-password" }} className="text-sm">
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
