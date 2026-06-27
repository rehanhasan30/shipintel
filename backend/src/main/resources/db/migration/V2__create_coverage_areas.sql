CREATE TABLE coverage_areas (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_update_coverage_areas_updated_at
    BEFORE UPDATE ON coverage_areas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
