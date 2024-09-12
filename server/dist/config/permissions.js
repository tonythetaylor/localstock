"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionsByRoles = exports.permissions = void 0;
const client_1 = require("@prisma/client");
exports.permissions = {
    basic: {
        read: "read",
        create: "create",
        update: "update",
        delete: "delete",
    },
};
const userPermissions = [exports.permissions.basic.read];
const managerPermissions = [...userPermissions, exports.permissions.basic.create, exports.permissions.basic.update];
const adminPermissions = [...managerPermissions, exports.permissions.basic.delete];
const permissionsByRole = {
    [client_1.Role.USER]: userPermissions,
    [client_1.Role.MANAGER]: managerPermissions,
    [client_1.Role.ADMIN]: adminPermissions,
};
const getPermissionsByRoles = (roles) => {
    const permissionsSet = new Set();
    roles.forEach((role) => {
        permissionsByRole[role].forEach((permission) => {
            permissionsSet.add(permission);
        });
    });
    const permissions = Array.from(permissionsSet);
    if (permissions.length === 0)
        return null;
    return permissions;
};
exports.getPermissionsByRoles = getPermissionsByRoles;
