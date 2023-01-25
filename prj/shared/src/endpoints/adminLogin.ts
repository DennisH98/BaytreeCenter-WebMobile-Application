import adminRole from "./adminRoles";

export interface AdminLoginRequest {
  username: string;
  password: string;
};

export interface AdminLoginResponse {
  user: AdminUser;
  token: string;
};

export interface AdminValidationResponse {
  user: AdminUser;
}

export interface AdminUser {
    username: string;
    role: adminRole;
}