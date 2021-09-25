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
    try {
      const { name, email, password } = req.body;
      const user = new User({ name, email, password });
      await user.save();
      res.send({
        data: omit(user, password),
      });
    } catch (e: any) {
      if (Array.isArray(e)) {
        res.status(400);
        res.send({
          errors: {
            title: "Incorrect form",
            detail: e[0].constraints,
          },
        });
        return;
      }
      if (e?.code === "ER_DUP_ENTRY") {
        res.status(409);
        res.send({
          errors: {
            title: "User duplication",
            detail: e,
          },
        });
        return;
      }
      res.status(500);
      res.send({
        errors: {
          title: "Unknown error",
          detail: e,
        },
      });
    }
  },
);

export default router;
