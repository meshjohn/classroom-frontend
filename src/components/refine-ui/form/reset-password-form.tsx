"use client";

import { useState } from "react";
import { useSearchParams } from "react-router";
import {
  useUpdatePassword,
  useLink,
  useRefineOptions,
  useGo,
} from "@refinedev/core";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner"; // Assuming sonner is used based on package.json
import { School } from "lucide-react";

export const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const Link = useLink();
  const go = useGo();
  const title = "Classroom";

  // We can use Refine's hook or call authClient directly.
  // Since authProvider.updatePassword in auth.ts might need adjustment to handle token,
  // let's try direct authClient call first for simplicity and certainty,
  // or checks if we should update authProvider.

  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!token) {
      toast.error("Invalid token");
      return;
    }

    setLoading(true);

    // Direct call to better-auth client
    const { data, error } = await authClient.resetPassword({
      newPassword: password,
      token: token,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "Failed to reset password");
    } else {
      toast.success("Password reset successfully");
      go({ to: "/login" });
    }
  };

  return (
    <div
      className={cn(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "px-6",
        "py-8",
        "min-h-svh",
      )}
    >
      <div className={cn("flex", "items-center", "justify-center", "gap-2")}>
        <div className={cn("text-foreground", "[&>svg]:w-12", "[&>svg]:h-12")}>
          <School />
        </div>
      </div>

      <Card className={cn("sm:w-[456px]", "p-12", "mt-6")}>
        <CardHeader className={cn("px-0")}>
          <CardTitle
            className={cn(
              "text-blue-600",
              "dark:text-blue-400",
              "text-3xl",
              "font-semibold",
            )}
          >
            Reset password
          </CardTitle>
          <CardDescription
            className={cn("text-muted-foreground", "font-medium")}
          >
            Enter your new password.
          </CardDescription>
        </CardHeader>

        <CardContent className={cn("px-0")}>
          <form onSubmit={handleResetPassword}>
            <div className={cn("flex", "flex-col", "gap-4")}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder=""
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder=""
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "bg-blue-600",
                  "hover:bg-blue-700",
                  "text-white",
                  "w-full",
                  "mt-2",
                )}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>

          <div className={cn("mt-8", "text-center")}>
            <Link
              to="/login"
              className={cn(
                "inline-flex",
                "items-center",
                "gap-2",
                "text-sm",
                "text-muted-foreground",
                "hover:text-foreground",
                "transition-colors",
              )}
            >
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

ResetPasswordForm.displayName = "ResetPasswordForm";
