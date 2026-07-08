-- 1. Recursive / Graph Constraints
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    manager_id INTEGER REFERENCES employee(id)
);

-- 2. Multi-column Composite Invariants
CREATE TABLE order_summary (
    id SERIAL PRIMARY KEY,
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) NOT NULL,
    shipped_qty INTEGER NOT NULL,
    ordered_qty INTEGER NOT NULL,
    
    -- Cross-field arithmetic 
    CONSTRAINT check_discount_bounds CHECK (discount <= subtotal),
    CONSTRAINT check_qty_bounds CHECK (shipped_qty <= ordered_qty)
);

-- 3. Temporal-Validity Constraints (Requires btree_gist extension)
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE pricing_policy (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    
    -- Temporal exclusion constraint (no overlapping dates for the same product)
    EXCLUDE USING gist (
        product_id WITH =,
        daterange(valid_from, valid_to) WITH &&
    )
);
