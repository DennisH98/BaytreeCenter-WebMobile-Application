import { AdminUser } from '../../../../shared/src/endpoints/adminLogin';
import { Optional } from 'typescript-optional';
import { AdminAccount, IAdminAccount } from '../../models/AdminAccount';


export async function findAdminByUsername(username: string): Promise<Optional<IAdminAccount>>{
    try {
      const adminAccount = await AdminAccount.findOne({
        username: username
      });
      if(!adminAccount){
        return Optional.empty<IAdminAccount>();
      } else {
        return Optional.ofNullable(adminAccount);
      }
    } catch(err) {
      console.error(err);
      return Optional.empty<IAdminAccount>();
    }
};
  
export function AdminUserFromAccount(adminAccount: IAdminAccount){
  const user : AdminUser = {
    username: adminAccount.username,
    role: adminAccount.role
  }
  
  return(user)
}