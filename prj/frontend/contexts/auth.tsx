import React, { createContext, useState, useContext, useEffect } from 'react'
import { AdminUser, AdminLoginRequest, AdminLoginResponse, AdminValidationResponse } from '../../shared/src/endpoints/adminLogin';
import { loadingScreen } from '../components/session/loadingScreen';
import { NextRouter, useRouter } from 'next/router';
import { apiPost, apiGet } from '../util/api';
import { route } from 'next/dist/server/router';

const AuthContext = createContext({} as {
    user: AdminUser,
    isAuthenticated: boolean,
    isValidating: boolean,
    login: Function,
    logout: Function,
});

const AUTH_PATH = "auth/admin";
const TOKEN_NAME = 'authToken';


export const AuthProvider = ({ children }) => {
    
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [isValidating, setValidating] = useState(false);

    useEffect(() => {
        router.events.on('routeChangeComplete', validateUser)
        validateUser();

        return () => {
          router.events.off('routeChangeComplete', validateUser)
        }
    }, [])

    const validateUser = async () => {
        setValidating(true);
        apiGet<AdminValidationResponse>(
            AUTH_PATH + "/validate",
            "",
            {Authorization:localStorage.getItem(TOKEN_NAME)},
        ).then((res) => {
            if(res.user){
                setUser(res.user);
                setAuthenticated(true);
            } else {
                setAuthenticated(false);
                throw new Error('verification failed');
                
            }
        }).catch((err) => {
            console.error(err);
            setAuthenticated(false);
        }).finally(() => {
            setValidating(false);
        })
    } 

    const login = async (parameters: AdminLoginRequest) => {
        apiPost<AdminLoginResponse, AdminLoginRequest>(
            AUTH_PATH + "/login",
            "",
            parameters 
        ).then((res) => {
            if(res.token && res.user){
                setUser(res.user);
                setAuthenticated(true);
                localStorage.setItem(TOKEN_NAME, 'Bearer ' + res.token);
                router.push('/');
            } else {
                throw new Error('invalid login response')
            }
        }).catch((err) => {
            console.error(err);
        })
    }

    const logout = () => {
        localStorage.removeItem(TOKEN_NAME);
        setAuthenticated(false);
    }
    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isValidating,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const ProtectRoute = ({ children }) => {
    const { isValidating } = useAuth();
    if (isValidating){
        return loadingScreen; 
    }
    return children;
  };

export const useAuth = () => useContext(AuthContext)