import express from "express";
import { AdminLoginRequest, AdminLoginResponse, AdminUser, AdminValidationResponse} from "../../../../shared/src/endpoints/adminLogin"
import { IAdminAccount } from "../../models/AdminAccount";
import { findAdminByUsername, AdminUserFromAccount } from "../../util/auth/adminUsers";
import { localStrategy } from '../../util/auth/localStrategy'
import { makeSessionToken, validateSession, instanceOfSession } from "../../util/auth/session";
export const adminAuthRouter = express.Router();

const passport = require("passport");
passport.use(localStrategy);
adminAuthRouter.use(passport.initialize());

adminAuthRouter.post<never, AdminLoginResponse, AdminLoginRequest>("/login", async (req, res) => {
    try {
        const adminAccount = await new Promise<IAdminAccount>((resolve, reject) => {
            passport.authenticate('local', { session: false }, (error: Error, adminAccount:IAdminAccount) => {
              if (error) {
                reject(error)
              } else {
                resolve(adminAccount)
              }
            })(req, res)
        })

        const user = AdminUserFromAccount(adminAccount);

        console.log("Login user: ",user);
        res.status(200).send({
            user: adminAccount, 
            token: await makeSessionToken(user)
        });
    } catch (err) {
        console.error(err);
        res.status(401).send();
    }
});

adminAuthRouter.get('/logout', async(req,res) => {
    req.logout();
    res.redirect('/login');
}); 

adminAuthRouter.get<never, AdminValidationResponse>('/validate',validateSession(), async (req, res) => {
    if(!instanceOfSession(res.locals.session)){
        res.status(401).send();
    }

    findAdminByUsername(res.locals.session.user.username).then(
        (adminAccountOptional) => {
            adminAccountOptional.ifPresentOrElse(
                (adminAccount) => {
                    res.status(200).send({
                        user: AdminUserFromAccount(adminAccount)
                    });
                }, () => {
                    res.status(401).send();
                }
            )
        }
    )
});