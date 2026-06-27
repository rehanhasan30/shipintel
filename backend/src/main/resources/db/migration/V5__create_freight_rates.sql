CREATE TABLE freight_rates (
    id BIGSERIAL PRIMARY KEY,
    courier_service_id BIGINT NOT NULL,
    origin_zip VARCHAR(20) NOT NULL,
    destination_zip VARCHAR(20) NOT NULL,
    min_weight_kg NUMERIC(10,2) NOT NULL,
    max_weight_kg NUMERIC(10,2) NOT NULL,
    cost NUMERIC(12,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    estimated_days INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_freight_rates_service FOREIGN KEY (courier_service_id) REFERENCES courier_services(id) ON DELETE CASCADE,
    CONSTRAINT chk_freight_rates_min_weight CHECK (min_weight_kg >= 0),
    CONSTRAINT chk_freight_rates_max_weight CHECK (max_weight_kg >= min_weight_kg),
    CONSTRAINT chk_freight_rates_cost CHECK (cost >= 0),
    CONSTRAINT chk_freight_rates_days CHECK (estimated_days > 0),
    CONSTRAINT chk_freight_rates_currency CHECK (length(currency) = 3)
);

CREATE INDEX idx_freight_rates_lookup ON freight_rates(origin_zip, destination_zip);
CREATE INDEX idx_freight_rates_service ON freight_rates(courier_service_id);

CREATE TRIGGER trigger_update_freight_rates_updated_at
    BEFORE UPDATE ON freight_rates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
