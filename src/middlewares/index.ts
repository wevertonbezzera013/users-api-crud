import express from "express";
import { getUserById } from "../db/users";

interface AuthenticatedRequest extends express.Request {
  identity?: Record<string, any>;
  userToDelete?: Record<string, any>;
}

export const canDeleteUser = async (
  req: AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;

    const currentUser = req.identity;

    if (currentUser?._id.toString() === id) {
      return res.status(403).json({ error: "Cannot delete yourself" });
    }

    const userToDelete = await getUserById(id);
    if (!userToDelete) {
      return res.status(404).json({ error: "User not found" });
    }

    req.userToDelete = userToDelete;

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
