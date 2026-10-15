export interface Lesson {
    id: number;
    course_id: number;
    section_name?: string;
    lesson_type?: "video" | "image";
    title: string;
    description: string;
    image_path?: string | null;
    image_url?: string | null;
    images?: string[];
    image_paths?: string[];
    video_type: "upload" | "youtube" | "url" | string;
    video_path?: string | null;
    video_url?: string | null;
    duration?: number;
    actual_duration?: string;
    duration_minutes: number | null;
    sort_order: number;
    is_free_preview: number | boolean;
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
    actual_duration?: string | null;
    created_at: string;
    total_lessons: number;
    updated_at: string;
    lessons: Lesson[];
}