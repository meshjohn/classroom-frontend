// src/providers/auth.ts
import { AuthProvider } from "@refinedev/core";
import { authClient } from "../lib/auth-client"; // Path to where you defined createAuthClient

export const authProvider: AuthProvider = {
  login: async ({ email, password, providerName }) => {
    console.log("AuthProvider Login called with:", { providerName, email });
    // SOCIAL (Google/GitHub)
    if (providerName) {
      console.log("Triggering Social Login for:", providerName);
      await authClient.signIn.social({
        provider: providerName as "google" | "github",
        callbackURL: import.meta.env.VITE_FRONTEND_URL,
      });
      return { success: true };
    }

    // MANUAL LOGIN
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) {
      return {
        success: false,
        error: {
          message: error.message || "Invalid credentials",
          statusCode: error.status || 401,
        },
      };
    }
    return { success: true, redirectTo: '/'};
  },

  register: async (params) => {
    const { email, password, name, providerName, role, imageCldPubId } = params;

    // 1. Redirect Social Signups to the Social Login flow
    // Better Auth handles "Registration via Social" through the Sign-In endpoint
    if (providerName) {
      return authProvider.login({ providerName });
    }

    // 2. Standard Email/Password Registration
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        console.error("Better Auth Error Details:", error);
        return {
          success: false,
          error: {
            message: error.message || "Registration Error",
            statusCode: error.status || 400,
          },
        };
      }

      return { success: true, redirectTo: '/' };
    } catch (err) {
      return {
        success: false,
        error: {
          message: "Server Error",
          statusCode: 500,
        },
      };
    }
  },

  check: async () => {
    // This is the session check that stops the redirect loop
    const { data: session } = await authClient.getSession();

    if (session) {
      return { authenticated: true };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

  logout: async () => {
    await authClient.signOut();
    return { success: true, redirectTo: "/login" };
  },

  getIdentity: async () => {
    const { data: session } = await authClient.getSession();
    if (session?.user) {
      return session.user;
    }
    return null;
  },

  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      return { logout: true };
    }
    return { logout: false };
  },

  forgotPassword: async ({ email }) => {
    try {
      // It is nested under .password
      const { data, error } = await (authClient as any).requestPasswordReset({
        email,
        redirectTo: `${import.meta.env.VITE_FRONTEND_URL}/reset-password`,
      });

      if (error) {
        return {
          success: false,
          error: {
            message: error.message || "Forgot Password Error",
            statusCode: error.status || 400,
          },
        };
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: {
          message: "Server Error",
          statusCode: 500,
        },
      };
    }
  },

  updatePassword: async ({ password }) => {
    try {
      // Also nested under .password
      const { data, error } = await authClient.resetPassword({
        newPassword: password,
      });

      if (error) {
        return {
          success: false,
          error: {
            message: error.message || "Update Error",
            statusCode: error.status || 400,
          },
        };
      }

      return { success: true, redirectTo: "/login" };
    } catch (err) {
      return {
        success: false,
        error: {
          message: "Server Error",
          statusCode: 500,
        },
      };
    }
  },
};
