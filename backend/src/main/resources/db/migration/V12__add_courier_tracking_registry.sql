-- Add tracking registry columns to couriers table
ALTER TABLE couriers
ADD COLUMN tracking_url_template VARCHAR(255),
ADD COLUMN tracking_regex VARCHAR(255),
ADD COLUMN support_email VARCHAR(100),
ADD COLUMN support_phone VARCHAR(50),
ADD COLUMN status VARCHAR(50) DEFAULT 'ACTIVE';

-- Seed/Update existing couriers with tracking metadata
UPDATE couriers 
SET tracking_url_template = 'https://www.delhivery.com/track/package/{AWB}',
    tracking_regex = '^(?:[0-9]{12}|[0-9]{10}|DL[0-9]{9}IN)$',
    support_email = 'support@delhivery.com',
    support_phone = '0124-6719500',
    status = 'ACTIVE'
WHERE name = 'Delhivery';

UPDATE couriers 
SET tracking_url_template = 'https://www.bluedart.com/tracking?awbNo={AWB}',
    tracking_regex = '^[0-9]{8,11}$',
    support_email = 'customerservice@bluedart.com',
    support_phone = '1860-233-1234',
    status = 'ACTIVE'
WHERE name = 'Blue Dart';

UPDATE couriers 
SET tracking_url_template = 'https://www.dtdc.in/tracking/tracking_results.asp?pinNo={AWB}',
    tracking_regex = '^[A-Z][0-9]{8}$',
    support_email = 'customersupport@dtdc.com',
    support_phone = '080-26963100',
    status = 'ACTIVE'
WHERE name = 'DTDC';

UPDATE couriers 
SET tracking_url_template = 'https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx?consignmentNo={AWB}',
    tracking_regex = '^[A-Z]{2}[0-9]{9}[A-Z]{2}$',
    support_email = 'customercare@indiapost.gov.in',
    support_phone = '1800-266-6868',
    status = 'ACTIVE'
WHERE name = 'India Post';

UPDATE couriers 
SET tracking_url_template = 'https://www.xpressbees.com/track?shipmentId={AWB}',
    tracking_regex = '^(?:[0-9]{14}|XB[0-9]{10})$',
    support_email = 'customercare@xpressbees.com',
    support_phone = '020-49116100',
    status = 'ACTIVE'
WHERE name = 'XpressBees';
