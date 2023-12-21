"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.register = exports.login = void 0;
const users_1 = require("../db/users");
const helpers_1 = require("../helpers");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.sendStatus(400);
        }
        const user = await (0, users_1.getUserByEmail)(email).select('+authentication.salt +authentication.password');
        if (!user) {
            return res.sendStatus(400);
        }
        const expectedHash = (0, helpers_1.authentication)(user.authentication?.salt ?? '', password);
        if (user.authentication?.password !== expectedHash) {
            return res.sendStatus(403);
        }
        const salt = (0, helpers_1.random)();
        user.authentication.sessionToken = (0, helpers_1.authentication)(salt, user._id.toString());
        await user.save();
        res.cookie('APP-AUTH', user.authentication?.sessionToken ?? '', {
            domain: 'localhost',
            path: '/',
        });
        console.log(`User logged in: ${user._id}`);
        return res.status(200).json(user).end();
    }
    catch (error) {
        console.log('Error in login:', error);
        return res.sendStatus(400);
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.sendStatus(400);
        }
        const existingUser = await (0, users_1.getUserByEmail)(email);
        if (existingUser) {
            return res.sendStatus(400);
        }
        const salt = (0, helpers_1.random)();
        const user = await (0, users_1.createUser)({
            email,
            username,
            authentication: {
                salt,
                password: (0, helpers_1.authentication)(salt, password),
            },
        });
        console.log(`User registered: ${user._id}`);
        return res.status(200).json(user).end();
    }
    catch (error) {
        console.log('Error in register:', error);
        return res.sendStatus(400);
    }
};
exports.register = register;
const logout = async (req, res) => {
    try {
        const sessionToken = req.cookies['APP-AUTH'];
        if (!sessionToken) {
            console.log('Unauthorized access - User not logged in');
            return res
                .status(401)
                .json({ error: 'Unauthorized - User not logged in' });
        }
        const user = await (0, users_1.getUserBySessionToken)(sessionToken);
        if (!user) {
            console.log('Unauthorized access - Invalid session token');
            return res
                .status(401)
                .json({ error: 'Unauthorized - Invalid session token' });
        }
        if (user.authentication) {
            user.authentication.sessionToken = null;
            await user.save();
        }
        res.clearCookie('APP-AUTH', { domain: 'localhost', path: '/' });
        console.log(`User logged out: ${user._id}`);
        return res.status(200).json({ message: 'Logout successful' });
    }
    catch (error) {
        console.log('Error in logout:', error);
        return res.sendStatus(500);
    }
};
exports.logout = logout;
//# sourceMappingURL=authentication.js.map