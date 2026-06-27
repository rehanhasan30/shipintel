CREATE TABLE contact_requests (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_contact_requests_type CHECK (type IN ('SUPPORT', 'SALES', 'GENERAL')),
    CONSTRAINT chk_contact_requests_status CHECK (status IN ('PENDING', 'IN_PROGRESS', 'RESOLVED'))
);

CREATE INDEX idx_contact_requests_status ON contact_requests(status);

CREATE TRIGGER trigger_update_contact_requests_updated_at
    BEFORE UPDATE ON contact_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
