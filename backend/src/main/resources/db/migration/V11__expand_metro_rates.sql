-- Expand Pincode & Freight Rates for Tier-1 Indian Metros:
-- Delhi (110001), Mumbai (400001), Bangalore (560001), Chennai (600001), Kolkata (700001), Hyderabad (500001)

-- Delhi (110001) <-> Bangalore (560001)
INSERT INTO freight_rates (courier_service_id, origin_zip, destination_zip, min_weight_kg, max_weight_kg, cost, currency, estimated_days) VALUES
((SELECT id FROM courier_services WHERE name = 'Delhivery Express'), '110001', '560001', 0.00, 5.00, 270.00, 'INR', 3),
((SELECT id FROM courier_services WHERE name = 'Delhivery Surface'), '110001', '560001', 0.00, 10.00, 160.00, 'INR', 6),
((SELECT id FROM courier_services WHERE name = 'Blue Dart Apex'), '110001', '560001', 0.00, 5.00, 380.00, 'INR', 2),
((SELECT id FROM courier_services WHERE name = 'XpressBees Express'), '110001', '560001', 0.00, 5.00, 240.00, 'INR', 3);

-- Delhi (110001) <-> Chennai (600001)
INSERT INTO freight_rates (courier_service_id, origin_zip, destination_zip, min_weight_kg, max_weight_kg, cost, currency, estimated_days) VALUES
((SELECT id FROM courier_services WHERE name = 'Delhivery Express'), '110001', '600001', 0.00, 5.00, 290.00, 'INR', 3),
((SELECT id FROM courier_services WHERE name = 'Blue Dart Apex'), '110001', '600001', 0.00, 5.00, 410.00, 'INR', 2),
((SELECT id FROM courier_services WHERE name = 'XpressBees Surface'), '110001', '600001', 0.00, 10.00, 150.00, 'INR', 7);

-- Mumbai (400001) <-> Bangalore (560001)
INSERT INTO freight_rates (courier_service_id, origin_zip, destination_zip, min_weight_kg, max_weight_kg, cost, currency, estimated_days) VALUES
((SELECT id FROM courier_services WHERE name = 'Delhivery Express'), '400001', '560001', 0.00, 5.00, 210.00, 'INR', 2),
((SELECT id FROM courier_services WHERE name = 'Delhivery Surface'), '400001', '560001', 0.00, 10.00, 120.00, 'INR', 4),
((SELECT id FROM courier_services WHERE name = 'Blue Dart Apex'), '400001', '560001', 0.00, 5.00, 290.00, 'INR', 1),
((SELECT id FROM courier_services WHERE name = 'DTDC Express'), '400001', '560001', 0.00, 5.00, 220.00, 'INR', 2),
((SELECT id FROM courier_services WHERE name = 'Speed Post'), '400001', '560001', 0.00, 5.00, 100.00, 'INR', 2);

-- Mumbai (400001) <-> Chennai (600001)
INSERT INTO freight_rates (courier_service_id, origin_zip, destination_zip, min_weight_kg, max_weight_kg, cost, currency, estimated_days) VALUES
((SELECT id FROM courier_services WHERE name = 'Delhivery Express'), '400001', '600001', 0.00, 5.00, 230.00, 'INR', 2),
((SELECT id FROM courier_services WHERE name = 'Blue Dart Apex'), '400001', '600001', 0.00, 5.00, 310.00, 'INR', 1),
((SELECT id FROM courier_services WHERE name = 'DTDC Lite'), '400001', '600001', 0.00, 10.00, 130.00, 'INR', 5);

-- Bangalore (560001) <-> Chennai (600001)
INSERT INTO freight_rates (courier_service_id, origin_zip, destination_zip, min_weight_kg, max_weight_kg, cost, currency, estimated_days) VALUES
((SELECT id FROM courier_services WHERE name = 'Delhivery Express'), '560001', '600001', 0.00, 5.00, 150.00, 'INR', 1),
((SELECT id FROM courier_services WHERE name = 'Delhivery Surface'), '560001', '600001', 0.00, 10.00, 90.00, 'INR', 3),
((SELECT id FROM courier_services WHERE name = 'Blue Dart Apex'), '560001', '600001', 0.00, 5.00, 190.00, 'INR', 1);

-- Kolkata (700001) <-> Delhi (110001)
INSERT INTO freight_rates (courier_service_id, origin_zip, destination_zip, min_weight_kg, max_weight_kg, cost, currency, estimated_days) VALUES
((SELECT id FROM courier_services WHERE name = 'Delhivery Express'), '700001', '110001', 0.00, 5.00, 280.00, 'INR', 3),
((SELECT id FROM courier_services WHERE name = 'Blue Dart Apex'), '700001', '110001', 0.00, 5.00, 390.00, 'INR', 2),
((SELECT id FROM courier_services WHERE name = 'Speed Post'), '700001', '110001', 0.00, 5.00, 140.00, 'INR', 3);

-- Kolkata (700001) <-> Mumbai (400001)
INSERT INTO freight_rates (courier_service_id, origin_zip, destination_zip, min_weight_kg, max_weight_kg, cost, currency, estimated_days) VALUES
((SELECT id FROM courier_services WHERE name = 'Delhivery Express'), '700001', '400001', 0.00, 5.00, 290.00, 'INR', 3),
((SELECT id FROM courier_services WHERE name = 'Blue Dart Apex'), '700001', '400001', 0.00, 5.00, 420.00, 'INR', 2);

-- Hyderabad (500001) <-> Bangalore (560001)
INSERT INTO freight_rates (courier_service_id, origin_zip, destination_zip, min_weight_kg, max_weight_kg, cost, currency, estimated_days) VALUES
((SELECT id FROM courier_services WHERE name = 'Delhivery Express'), '500001', '560001', 0.00, 5.00, 160.00, 'INR', 1),
((SELECT id FROM courier_services WHERE name = 'Blue Dart Apex'), '500001', '560001', 0.00, 5.00, 210.00, 'INR', 1),
((SELECT id FROM courier_services WHERE name = 'XpressBees Surface'), '500001', '560001', 0.00, 10.00, 80.00, 'INR', 3);

-- Hyderabad (500001) <-> Mumbai (400001)
INSERT INTO freight_rates (courier_service_id, origin_zip, destination_zip, min_weight_kg, max_weight_kg, cost, currency, estimated_days) VALUES
((SELECT id FROM courier_services WHERE name = 'Delhivery Express'), '500001', '400001', 0.00, 5.00, 220.00, 'INR', 2),
((SELECT id FROM courier_services WHERE name = 'Blue Dart Apex'), '500001', '400001', 0.00, 5.00, 300.00, 'INR', 1);
