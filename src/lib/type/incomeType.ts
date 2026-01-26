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