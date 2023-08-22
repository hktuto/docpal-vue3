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
    userPermission: Permission;
    holdStatus?: HoldStatus
}
export const AllowTo = ({feature, userPermission, holdStatus}:AllowToArgs) => {
    if(!holdStatus) holdStatus = ''
    if (!userPermission || ['A', 'L', 'P'].includes(holdStatus) && feature !== 'Read' ) {
        return false;
    }
    return PermissionArray.indexOf(userPermission) >= PermissionArray.indexOf(feature);
};