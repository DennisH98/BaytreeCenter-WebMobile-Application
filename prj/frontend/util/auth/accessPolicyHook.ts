import { useEffect } from 'react'
import { useRouter } from 'next/router';
import { accessQualifier, byMostRestrictive} from "./accessPolicy"
import { useAuth } from "../../contexts/auth";
import adminRole from "../../../shared/src/endpoints/adminRoles"



export const useAdminAccessPolicy = () => {useAccessPolicy(byMostRestrictive(adminRole.ADMIN))};

export function useAccessPolicy(checkPrivilege: accessQualifier) {
    
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if ( !isAuthenticated || !user || !checkPrivilege(user.role)){
            router.push('/login');
        }
    }, [isAuthenticated, user]);
}