import express from "express";

import { deleteUser, getAllUsers, updateUser } from "../controllers/users";
import { canDeleteUser, isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.delete("/users/:id", isAuthenticated, canDeleteUser, deleteUser);
  router.patch("/users/:id", isAuthenticated, updateUser);
};
