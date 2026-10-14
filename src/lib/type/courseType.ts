export interface CourseFormData {
    title: string;
    description: string;
    reward_points: number;
    price: number;
    duration: string;
    thumbnail: FileList;
    instructor: string
};

export type CourseType = {
    id: number;
    title: string;
    instructor: string | null; // can be null
    description: string;
    thumbnail: string; // URL as string
    price: string; // string because your JSON shows "49.99" as string
    reward_points: string;
    is_published: boolean; // 0 for draft, 1 for published
    duration: string; // e.g., "5 hours"
    total_lessons?: number;
    created_at: string; // ISO datetime string
    updated_at: string; // ISO datetime string
};