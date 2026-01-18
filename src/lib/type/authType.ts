export interface AdminLoginPayloadType {
    email: string;
    password: string
}

// Type for Role
type Role = {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot: {
        model_type: string;
        model_id: number;
        role_id: number;
    };
};

// Type for User
type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    phone: string | null;
    avatar: string | undefined;
    dob: string | null;
    address: string | null;
    status: string;
    current_reward_points: number;
    created_at: string;
    updated_at: string;
    stripe_id: string | null;
    pm_type: string | null;
    pm_last_four: string | null;
    trial_ends_at: string | null;
    roles: Role[];
    permissions: string[]; // if you know the structure of permissions, replace 'any' with a proper type
};

// Type for the login response data
type LoginResponseData = {
    access_token: string;
    token_type: string;
    user: User;
};

// Type for the entire API response
export interface LoginApiResponsetype {
    ok: boolean;
    message: string;
    data: LoginResponseData;
};




// user profile type 



// Pivot type
export type RolePivot = {
    model_type: string;
    model_id: number;
    role_id: number;
};

// Role type
export type UserRole = {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot: RolePivot;
};

// User data type
export type UserDetails = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    phone: string | null;
    avatar: string | null;
    dob: string | null;
    address: string | null;
    status: "active" | "inactive";
    current_reward_points: number;
    created_at: string;
    updated_at: string;
    stripe_id: string | null;
    pm_type: string | null;
    pm_last_four: string | null;
    trial_ends_at: string | null;
    roles: Role[];
    permissions: string[];
};

// API response type
export interface UserResponseType {
    ok: boolean;
    message: string;
    data: User;
};
