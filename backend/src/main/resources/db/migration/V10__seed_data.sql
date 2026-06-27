-- Seed Couriers
INSERT INTO couriers (name, description, website_url) VALUES
('Delhivery', 'One of India''s largest fully integrated logistics services providers.', 'https://www.delhivery.com'),
('DTDC', 'A leading express courier service provider in India.', 'https://www.dtdc.in'),
('Blue Dart', 'South Asia''s premier express air and integrated transportation & distribution company.', 'https://www.bluedart.com'),
('India Post', 'The government-operated postal system in India.', 'https://www.indiapost.gov.in'),
('XpressBees', 'An express logistics service provider in India specializing in e-commerce.', 'https://www.xpressbees.com');

-- Seed Coverage Areas
INSERT INTO coverage_areas (name) VALUES
('Domestic (All India)'),
('North India'),
('South India'),
('International');

-- Map Couriers to Coverage Areas
INSERT INTO courier_coverage_areas (courier_id, coverage_area_id)
SELECT c.id, ca.id FROM couriers c, coverage_areas ca
WHERE c.name = 'Delhivery' AND ca.name IN ('Domestic (All India)', 'North India', 'South India');

INSERT INTO courier_coverage_areas (courier_id, coverage_area_id)
SELECT c.id, ca.id FROM couriers c, coverage_areas ca
WHERE c.name = 'DTDC' AND ca.name IN ('Domestic (All India)', 'North India', 'South India', 'International');

INSERT INTO courier_coverage_areas (courier_id, coverage_area_id)
SELECT c.id, ca.id FROM couriers c, coverage_areas ca
WHERE c.name = 'Blue Dart' AND ca.name IN ('Domestic (All India)', 'North India', 'South India', 'International');

INSERT INTO courier_coverage_areas (courier_id, coverage_area_id)
SELECT c.id, ca.id FROM couriers c, coverage_areas ca
WHERE c.name = 'India Post' AND ca.name IN ('Domestic (All India)', 'International');

INSERT INTO courier_coverage_areas (courier_id, coverage_area_id)
SELECT c.id, ca.id FROM couriers c, coverage_areas ca
WHERE c.name = 'XpressBees' AND ca.name IN ('Domestic (All India)', 'North India', 'South India');

-- Seed Courier Services
INSERT INTO courier_services (courier_id, name, transport_mode) VALUES
((SELECT id FROM couriers WHERE name = 'Delhivery'), 'Delhivery Express', 'AIR'),
((SELECT id FROM couriers WHERE name = 'Delhivery'), 'Delhivery Surface', 'ROAD'),
((SELECT id FROM couriers WHERE name = 'DTDC'), 'DTDC Express', 'AIR'),
((SELECT id FROM couriers WHERE name = 'DTDC'), 'DTDC Lite', 'ROAD'),
((SELECT id FROM couriers WHERE name = 'DTDC'), 'DTDC International', 'AIR'),
((SELECT id FROM couriers WHERE name = 'Blue Dart'), 'Blue Dart Apex', 'AIR'),
((SELECT id FROM couriers WHERE name = 'Blue Dart'), 'Blue Dart Surfaceline', 'ROAD'),
((SELECT id FROM couriers WHERE name = 'India Post'), 'Speed Post', 'AIR'),
((SELECT id FROM couriers WHERE name = 'India Post'), 'Registered Post', 'ROAD'),
((SELECT id FROM couriers WHERE name = 'XpressBees'), 'XpressBees Express', 'AIR'),
((SELECT id FROM couriers WHERE name = 'XpressBees'), 'XpressBees Surface', 'ROAD');

-- Seed Freight Rates
INSERT INTO freight_rates (courier_service_id, origin_zip, destination_zip, min_weight_kg, max_weight_kg, cost, currency, estimated_days) VALUES
((SELECT id FROM courier_services WHERE name = 'Delhivery Express'), '110001', '400001', 0.00, 5.00, 250.00, 'INR', 2),
((SELECT id FROM courier_services WHERE name = 'Delhivery Express'), '110001', '400001', 5.01, 10.00, 450.00, 'INR', 2),
((SELECT id FROM courier_services WHERE name = 'Delhivery Surface'), '110001', '400001', 0.00, 10.00, 150.00, 'INR', 5),
((SELECT id FROM courier_services WHERE name = 'DTDC Express'), '110001', '560001', 0.00, 5.00, 300.00, 'INR', 3),
((SELECT id FROM courier_services WHERE name = 'DTDC Lite'), '110001', '560001', 0.00, 10.00, 180.00, 'INR', 6),
((SELECT id FROM courier_services WHERE name = 'Blue Dart Apex'), '110001', '400001', 0.00, 3.00, 350.00, 'INR', 1),
((SELECT id FROM courier_services WHERE name = 'Blue Dart Apex'), '110001', '400001', 3.01, 10.00, 600.00, 'INR', 1),
((SELECT id FROM courier_services WHERE name = 'Blue Dart Surfaceline'), '110001', '400001', 0.00, 10.00, 220.00, 'INR', 4),
((SELECT id FROM courier_services WHERE name = 'Speed Post'), '110001', '600001', 0.00, 5.00, 120.00, 'INR', 3),
((SELECT id FROM courier_services WHERE name = 'Registered Post'), '110001', '600001', 0.00, 5.00, 50.00, 'INR', 7);

-- Seed Article Categories
INSERT INTO article_categories (name, slug) VALUES
('Logistics Guides', 'logistics-guides'),
('Shipping Regulations', 'shipping-regulations'),
('E-commerce Shipping', 'ecommerce-shipping');

-- Seed Articles
INSERT INTO articles (category_id, title, slug, content, published_at) VALUES
((SELECT id FROM article_categories WHERE name = 'Logistics Guides'), 'Understanding Volumetric Weight in Indian Shipping', 'understanding-volumetric-weight-india', 'Volumetric weight, sometimes called dimensional weight, is a billing technique for commercial freight transport which uses an estimated weight that is calculated from the length, width and height of a package. Formula: (Length x Width x Height in cm) / 5000.', NOW()),
((SELECT id FROM article_categories WHERE name = 'Shipping Regulations'), 'E-Way Bill Requirements for Interstate Transport in India', 'eway-bill-requirements-india', 'Under the GST regime, transporters must carry an E-Way Bill when moving goods from one state to another if the value of the consignment exceeds INR 50,000.', NOW()),
((SELECT id FROM article_categories WHERE name = 'E-commerce Shipping'), 'Choosing the Best Cash on Delivery (COD) Partners', 'choosing-cod-partners-india', 'Cash on Delivery remains a critical payment mode in India. Choosing a partner with low COD remittance cycles (like Delhivery or XpressBees) is essential for maintaining healthy business cashflow.', NOW());
