import { AdminUser } from "../../../../shared/src/endpoints/adminLogin";

declare global {
    namespace Express {
      interface User extends AdminUser {
        username: string;
        id: string;
      }
    }
  }