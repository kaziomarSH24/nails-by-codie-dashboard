export interface Lesson {
    id: number;
    course_id: number;
    title: string;
    description: string;
    video_type: "upload" | "youtube" | string;
    video_path: string;
    video_url: string;
    duration_minutes: number | null;
    sort_order: number;
    is_free_preview: number; // 0 | 1
    created_at: string;
    updated_at: string;
}

export interface CourseLessonType {
    id: number;
    title: string;
    instructor: string;
    description: string;
    thumbnail: string;
    price: string;
    reward_points: number;
    is_published: number; // 0 | 1
    duration: string;
    created_at: string;
    total_lessons: number;
    updated_at: string;
    lessons: Lesson[];
}