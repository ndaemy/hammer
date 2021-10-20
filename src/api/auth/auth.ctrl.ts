import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import { Request, Response } from "express";
import { omit, pick } from "lodash";
import EmailVerifyToken from "../../entity/EmailVerifyToken";
import User from "../../entity/User";

const sendTokenToEmail = async (user: User, res: Response) => {
  // create emailVerifyToken and send email
  const token = crypto.randomBytes(20).toString("hex");
  const emailVerifyToken = new EmailVerifyToken({
    token,
    user,
  });
  // TODO: Email 내용은 추후 수정되어야 함
  const msg = {
    to: user.email,
    from: "test@sakura-hammer.com",
    subject: "Email Verification",
    html: `Your token is ${token}`,
  };
  try {
    await sgMail.send(msg);
  } catch (e) {
    res.status(500);
    res.send({
      errors: {
        title: "Cannot send mail",
        detail: e?.response,
      },
    });
  }
  await emailVerifyToken.save();
};

interface SignUpBody {
  name: string;
  email: string;
  password: string;
}

export const SignUp = async (
  req: Request<never, never, SignUpBody>,
  res: Response,
) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });

  // validate form
  const errors = await user.validate();
  if (errors.length > 0) {
    res.status(400);
    res.send({
      errors: {
        title: "Incorrect form",
        detail: errors[0].constraints,
      },
    });
    return;
  }

  // check duplication
  const exist = await User.findOne({ email });
  if (exist) {
    res.status(409);
    res.send({
      errors: {
        title: "User duplication",
        detail: "User with given email already exist",
      },
    });
    return;
  }

  await user.save();

  await sendTokenToEmail(user, res);

  res.send({
    data: omit(user, "password"),
  });
};

interface EmailVerifyBody {
  email: string;
}

export const EmailVerify = async (
  req: Request<never, never, EmailVerifyBody>,
  res: Response,
) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      errors: {
        title: "User not exist",
        detail: "User is not registered. Please sign up first.",
      },
    });
  }

  const oldEmailVerifyToken = await EmailVerifyToken.findOne({
    where: {
      user,
    },
  });
  if (oldEmailVerifyToken) {
    await oldEmailVerifyToken.remove();
  }

  await sendTokenToEmail(user, res);

  res.json({
    data: {
      email: user.email,
    },
  });
};

interface EmailVerifyTokenParams {
  token: string;
}

export const EmailVerifyWithToken = async (
  req: Request<EmailVerifyTokenParams>,
  res: Response,
) => {
  const token = await EmailVerifyToken.findOne({
    where: {
      token: req.params.token,
    },
    relations: ["user"],
  });

  if (!token || token.expiredAt < new Date()) {
    if (token) {
      await token.remove();
    }
    res.status(410).json({
      errors: {
        title: "Token not valid",
        detail:
          "Token is not exist or has been expired. Please regenerate token and verify again.",
      },
    });
    return;
  }

  token.user.isEmailConfirmed = true;
  await token.user.save();
  await token.remove();

  res.json({
    data: pick(token.user, ["id", "isEmailConfirmed"]),
  });
};
