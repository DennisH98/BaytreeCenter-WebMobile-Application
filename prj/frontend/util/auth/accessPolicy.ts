import adminRole from "../../../shared/src/endpoints/adminRoles"

export interface accessPolicy {
    (referenceRole: adminRole): accessQualifier
}

export interface accessQualifier {
    (role: adminRole): boolean
}

export const byMostRestrictive: accessPolicy = (referenceRole: adminRole) => {
    return (role: adminRole) => { console.log("policy - user:",role,"reference",referenceRole);return role >= referenceRole};
}
