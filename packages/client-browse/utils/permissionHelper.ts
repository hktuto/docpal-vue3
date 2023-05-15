type Permission = "Read" | "ReadWrite" | "ManageRecord" | "ManageLegalHold" | "Everything";

const PermissionArray:Permission[] = ["Read", "ReadWrite", "ManageRecord","ManageLegalHold", "Everything"];

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