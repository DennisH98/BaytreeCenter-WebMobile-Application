import { AdminUser } from '../../../../shared/src/endpoints/adminLogin';
import { Optional } from 'typescript-optional';
import { findAdminByUsername} from './adminUsers';
import {Request, Response, NextFunction } from "express";
const jwt = require('jsonwebtoken')

export interface Session {
    user: AdminUser;
    createdAt: number;
    maxAge: number;
}

export function instanceOfSession(obj: any): obj is Session {
    return obj
    && obj.user
    && obj.createdAt && typeof(obj.createdAt) == 'number'
    && obj.maxAge && typeof(obj.maxAge) == 'number'
}

const MAX_AGE = 60 * 60 * 8 // 8 hours

export async function makeSessionToken(user: AdminUser) {
    const createdAt = Date.now();
    const session: Session = { user, createdAt, maxAge: MAX_AGE };
    return await jwt.sign(session, process.env.JWT_SECRET);
}

export function validateSession(){
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.header('Authorization')?.split('Bearer ')[1];

        if (!token){
            res.status(401).send();
            return;
        }
        try {
            const session = jwt.verify(token, process.env.JWT_SECRET);
            if(!instanceOfSession(session)){
                res.status(401).send();
                return;
            }
            
            const expiresAt = session.createdAt + session.maxAge * 1000;
            if (Date.now() > expiresAt) {
                res.status(401).send();
                return;
            }

            res.locals.session = session;
            next();
        } catch (err) {
            res.status(401).send();
            return;
        }
    }
}