export type Notification = {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: {
        title: string;
        message: string;
        icon: string;
        type: "info" | "success" | "warning" | "error" | string;
        action: {
            link: string;
            is_external: boolean;
        };
        meta: {
            amount: null,
            order_id: number
        }
    };
    read_at: string | null;
    created_at: string;
    updated_at: string;
};