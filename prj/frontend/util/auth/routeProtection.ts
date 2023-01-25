import adminRole from '../../../shared/src/endpoints/adminRoles';
import { byMostRestrictive } from './accessPolicy';

//unlisted routes use default permission

const routeFilters = {
    'default' : byMostRestrictive(adminRole.ADMIN),
    '/login' : byMostRestrictive(adminRole.UNREGISTERED),
}


const  evaluateRoutePermission = (userRole: adminRole, route: string) => {
    if(routeFilters[route]) {
        return routeFilters[route](userRole);
    } else {
        return routeFilters['default'](userRole);
    }
};

export default evaluateRoutePermission;