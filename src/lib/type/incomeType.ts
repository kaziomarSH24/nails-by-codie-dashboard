type MetricValue = {
    value: number;
    growth: number;
};

export interface DashboardStats {
    total_income: MetricValue;
    product_income: MetricValue;
    course_income: MetricValue;
    total_transactions: MetricValue;
};


export interface Transaction {
    id: number;
    date: string;
    source: string;
    item_name: string;
    user_name: string;
    amount: string;
    status: string;
    action_id: number;
}


export interface TransactionUser {
    name: string;
    email: string;
    avatar: string; // URL
}

export interface TransactionBreakdownItem {
    label: string;
    value: string; // keep string because backend sends "218.00", "-15.00"
}

export interface TransactionRelatedLink {
    type: string;        // e.g. "Enrollment"
    label: string;       // e.g. "Course"
    display_text: string;
    id: number;
}

export interface TransactionDetailsResponse {
    transaction_id: string;
    date: string;        // "24 Jan, 10:08 AM"
    status: "Success" | "Pending" | "Failed";
    source_reference: string;
    user: TransactionUser;
    breakdown: TransactionBreakdownItem[];
    total_amount: string;
    currency: string;    // e.g. "USD"
    related_link: TransactionRelatedLink;
}