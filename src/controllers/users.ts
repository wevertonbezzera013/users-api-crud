import express from "express";

import {
  UserModel,
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from "../db/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getAllUsersIncludingDeleted();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getAllUsersIncludingDeleted = () => {
  return UserModel.find();
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deleteUser = await deleteUserById(id);
    return res.json(deleteUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(error);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    if (!username && !email) {
      return res.status(400).json({
        error: "At least one field (username or email) is required for update",
      });
    }

    const user = await getUserById(id);

    if (username) {
      user.username = username;
    }

    if (email) {
      user.email = email;
    }

    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
