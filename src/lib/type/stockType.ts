export interface StockOverviewType {
    id: number;
    title: string;
    sku: string | null;
    stock_quantity: number;
    low_stock_threshold: number;
    image_url: string;
    status: string;
    stock_status: string

}



export interface StockRequestType {
    id: number;
    title: string;
    sku: string | null;
    stock_quantity: number;
    low_stock_threshold: number;
    image_url: string;
    status: string;
    stock_status: string
}