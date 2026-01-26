export interface UserRewardPoints {
    id: number;
    user_name: string;
    email: string;
    available_points: number;
    total_points: number;
    redeemed_points: number;
    last_redeemed: string | null; // null when never redeemed
};