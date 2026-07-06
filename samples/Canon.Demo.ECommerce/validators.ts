export function validate_customers_age(value: any): boolean {
    return true;
}

export function validate_orders_total_amount(value: any): boolean {
    return true /* opaque sql */;
}

export function validate_products_price(value: any): boolean {
    return true /* opaque sql */;
}

export function validate_products_stock(value: any): boolean {
    return value.stock >= 0;
}