import { createUser, getUserByEmail, getUserBySessionToken } from "../db/users";
import express from "express";
import { authentication, random } from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(403);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie("APP-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.sendStatus(400);
    }
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const logout = async (req: express.Request, res: express.Response) => {
  try {
    // Assuming you are storing the session token in cookies
    const sessionToken = req.cookies["APP-AUTH"];

    if (!sessionToken) {
      return res
        .status(401)
        .json({ error: "Unauthorized - User not logged in" });
    }

    const user = await getUserBySessionToken(sessionToken);

    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized - Invalid session token" });
    }

    // Invalidate the session token
    user.authentication.sessionToken = null;

    // Save the user to update the session token
    await user.save();

    // Clear the session cookie
    res.clearCookie("APP-AUTH", { domain: "localhost", path: "/" });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
