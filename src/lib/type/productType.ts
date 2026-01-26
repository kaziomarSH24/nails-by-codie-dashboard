export type ProductType = {
    id: number;
    shopify_product_id: string;
    shopify_variant_id: string;
    title: string;
    category: string;
    price: string;
    image_url: string;
    sku: string | null;
    stock_quantity: number;
    low_stock_threshold: number;
    last_synced_at: string;
    status: string;
    created_at: string;
    updated_at: string;
    stock_status: string;
    earnable_points: number;
};