type Permission = "Write" | "ReadWrite" | "ManageRecord" | "Everything";

const PermissionArray:Permission[] = ["Write", "ReadWrite", "ManageRecord", "Everything"];

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