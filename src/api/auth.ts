import { Request, Response, Router } from "express";
import { omit } from "lodash";
import User from "../entity/User";

const router = Router();

interface SignUpBody {
  name: string;
  email: string;
  password: string;
}

router.post(
  "/sign-up",
  async (req: Request<never, never, SignUpBody>, res: Response) => {
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
    res.send({
      data: omit(user, "password"),
    });
  },
);

export default router;
