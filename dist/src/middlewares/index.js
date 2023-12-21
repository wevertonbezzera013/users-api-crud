"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canDeleteUser = void 0;
const users_1 = require("../db/users");
const canDeleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentUser = req.identity;
        if (currentUser?._id.toString() === id) {
            console.log('Attempt to delete own user account');
            return res.status(403).json({ error: 'Cannot delete yourself' });
        }
        const userToDelete = await (0, users_1.getUserById)(id);
        if (!userToDelete) {
            console.log(`User not found with id: ${id}`);
            return res.status(404).json({ error: 'User not found' });
        }
        req.userToDelete = userToDelete;
        return next();
    }
    catch (error) {
        console.log('Error in canDeleteUser middleware:', error);
        return res.sendStatus(400);
    }
};
exports.canDeleteUser = canDeleteUser;
//# sourceMappingURL=index.js.map