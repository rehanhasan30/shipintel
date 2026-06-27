CREATE TABLE courier_coverage_areas (
    courier_id BIGINT NOT NULL,
    coverage_area_id BIGINT NOT NULL,
    PRIMARY KEY (courier_id, coverage_area_id),
    FOREIGN KEY (courier_id) REFERENCES couriers(id) ON DELETE CASCADE,
    FOREIGN KEY (coverage_area_id) REFERENCES coverage_areas(id) ON DELETE CASCADE
);
