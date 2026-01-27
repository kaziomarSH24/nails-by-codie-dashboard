export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    dob: string; // ISO date string (YYYY-MM-DD)
    avatar: string | null;
    status: "active" | "inactive" | "suspended";
    address: string | null;
    created_at: string; // ISO datetime string
};


export interface Appointment {
    id: number;
    client_name: string;
    status: "upcoming" | "completed" | "cancelled";
    created_at: string; // ISO datetime
};


export interface Course {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    created_at: string;
};

export interface Enrollment {
    id: number;
    user_id: number;
    course_id: number;
    course: Course;
    status: "pending" | "active" | "completed" | "cancelled";
    enrolled_at: string;
    created_at: string;
};



export interface UserDetails {
    id: number;
    name: string;
    email: string;
    phone: string;
    dob: string | null;
    avatar: string | null;
    status: "active" | "inactive" | "suspended";
    address: string | null;
    created_at: string;

    enrollments: Appointment[];
    appointments: Enrollment[];
};
