import { Request, Response, Router } from "express";
import User from "../entity/User";
import { omit } from "lodash";

const router = Router();

interface UserIdParams {
  userId: string;
}

router.get("/:userId", async (req: Request<UserIdParams>, res: Response) => {
  const user = await User.findOne({ id: +req.params.userId });
  if (!user) {
    res.status(404);
    res.send({
      errors: {
        title: "No user found",
      },
    });
    return;
  }

  res.send({
    data: omit(user, "password"),
  });
});

export default router;
