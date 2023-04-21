type Permission = "Write" | "Edit" | "Manage" | "Everything";

const PermissionArray:Permission[] = ["Write", "Edit", "Manage", "Everything"];

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