import { Resend } from "resend";
import { ENV } from "./env.js";

// Only create resend client if API key exists
export const resendClient = ENV.RESEND_API_KEY
  ? new Resend(ENV.RESEND_API_KEY)
  : null;

// Safe sender config
export const sender = {
  email: ENV.EMAIL_FROM || "onboarding@resend.dev",
  name: ENV.EMAIL_FROM_NAME || "Chat App",
};
