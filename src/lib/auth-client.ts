// src/authClient.ts
import { createAuthClient } from "better-auth/react";

const backendUrl = import.meta.env.VITE_BACKEND_BASE;
console.log("Auth Client Base URL:", backendUrl);

export const authClient = createAuthClient({
  baseURL: backendUrl,
  user: {
    additionalFields: {
      role: {
        type: "string",

        required: true,
        defaultValue: "student",
        input: true,
      },
      department: {
        type: "string",
        required: false,
        input: true,
      },
      imageCldPubId: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
});
