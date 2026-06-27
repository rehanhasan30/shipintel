CREATE TABLE courier_services (
    id BIGSERIAL PRIMARY KEY,
    courier_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    transport_mode VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_courier_services_courier FOREIGN KEY (courier_id) REFERENCES couriers(id) ON DELETE CASCADE,
    CONSTRAINT chk_courier_services_mode CHECK (transport_mode IN ('AIR', 'SEA', 'ROAD'))
);

CREATE INDEX idx_courier_services_mode ON courier_services(transport_mode);
CREATE INDEX idx_courier_services_courier_id ON courier_services(courier_id);

CREATE TRIGGER trigger_update_courier_services_updated_at
    BEFORE UPDATE ON courier_services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
