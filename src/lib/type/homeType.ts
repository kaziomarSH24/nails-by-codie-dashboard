


export interface StatusType {
    label: string;
    value: string;
    growth: number;
    growth_label: string;
    is_positive: boolean
}

export interface NotificationType {
    type: string;
    icon: string;
    title: string;
    subtitle: string;
    time: string
}


export interface RecentActivityType {
    title : string;
    subtitle : string;
    time : string
}