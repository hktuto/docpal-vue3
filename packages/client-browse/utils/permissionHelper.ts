type Permission = "Write" | "Read" | "Manage" | "Everything";

const PermissionArray:Permission[] = ["Write", "Read", "Manage", "Everything"];

type PermissionAllowArgs = {
    feature: Permission;
    userPermission: Permission;
}
export const permissionAllow = ({feature, userPermission}:PermissionAllowArgs) => {
    if (!userPermission) {
        return false;
    }
    return PermissionArray.indexOf(userPermission) >= PermissionArray.indexOf(feature);
};