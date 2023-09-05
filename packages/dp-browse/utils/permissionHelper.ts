export type AllPermission = {
    permission: Permission,
    print: boolean,
    hold: any,
    retention: any
}
export type Permission = "Read" | "ReadWrite" | "ManageRecord" | "ManageLegalHold" | "Everything";
/**
 * A: active
 * D: de-active
 * R: remove
 * P: pending add
 * L: pending remove
 */
export type HoldStatus = "A" | "D" | "R" | "P" | "L" | "";
const PermissionArray:Permission[] = ["Read", "ReadWrite", "ManageRecord","ManageLegalHold", "Everything"];

type AllowToArgs = {
    feature: Permission;
    permission: AllPermission
}
export const AllowTo = ({feature, permission}:AllowToArgs) => {
    if (!!permission.hold && ['A', 'L', 'P'].includes(permission.hold.status)) return false
    if (!!permission.retention && permission.retention.status) return false
    const userPermission = permission.permission
    // ['A', 'L', 'P'].includes(holdStatus)
    if (!userPermission || feature === 'Read') {
        return false;
    }
    return PermissionArray.indexOf(userPermission) >= PermissionArray.indexOf(feature);
};