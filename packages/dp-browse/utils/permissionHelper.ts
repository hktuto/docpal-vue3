export type Permission = "Read" | "ReadWrite" | "ManageRecord" | "ManageLegalHold" | "Everything";

const PermissionArray:Permission[] = ["Read", "ReadWrite", "ManageRecord","ManageLegalHold", "Everything"];

type AllowToArgs = {
    feature: Permission;
    userPermission: Permission;
}
export const AllowTo = ({feature, userPermission}:AllowToArgs) => {
    if (!userPermission) {
        return false;
    }
    return PermissionArray.indexOf(userPermission) >= PermissionArray.indexOf(feature);
};