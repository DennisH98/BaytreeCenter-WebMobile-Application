import Local from 'passport-local'
import bcrypt from "bcrypt";
import { findAdminByUsername } from './adminUsers';

export const localStrategy = new Local.Strategy(
async function(username: string,password: string, done: Function) {

  console.log("logging in user:"+username+" pass:"+password)

  const adminAccountOptional = await findAdminByUsername(username);

  adminAccountOptional.ifPresentOrElse((adminAccount) => {
    if(bcrypt.compareSync(password, adminAccount.password)){
      done(null, adminAccount);
    } else {
      done(null, false, {message: "invalid password"})
    }
  }, () => {
    done(null, false, {message: "invalid username"})
  });
});