"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../controllers/users");
const middlewares_1 = require("../middlewares");
exports.default = (router) => {
    router.get('/users', users_1.getAllUsers);
    router.delete('/users/:id', middlewares_1.canDeleteUser, users_1.deleteUser);
    router.patch('/users/:id', users_1.updateUser);
};
//# sourceMappingURL=users.js.map