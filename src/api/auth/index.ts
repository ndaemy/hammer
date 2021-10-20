import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { Router } from "express";
import { EmailVerify, EmailVerifyWithToken, SignUp } from "./auth.ctrl";

dotenv.config();

if (!process.env.SENDGRID_API_KEY) {
  throw Error("SENDGRID API KEY not defined");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const router = Router();

router.post("/sign-up", SignUp);
router.post("/email-verify", EmailVerify);
router.post("/email-verify/:token", EmailVerifyWithToken);

export default router;
