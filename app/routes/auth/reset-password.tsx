import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/common/button";
import Input from "~/components/common/input";

export default function ResetPassword() {
  return (
    <div className="flex flex-col items-center  gap-4 my-12">
      <h1 className="text-2xl font-bold">Reset password</h1>
      <div className="flex bg-base-100 p-8 rounded-xl flex-col  gap-4 min-w-[300px] shadow-sm">
        <Link
          to={{ pathname: "/" }}
          className="text-sm flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to <b>Home</b>
        </Link>
        <div className="flex flex-col gap-1">
          <Input
            label="New Password"
            placeholder="New Password"
            type="password"
            name="password"
          />
          <Input
            label="Confirm Password"
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
          />
        </div>
        <Button variant="primary">Reset password</Button>
      </div>
    </div>
  );
}
