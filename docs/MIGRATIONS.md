# ShipIntel Database Migration & Rollback Guide

This guide details the Flyway migration scripts created for the ShipIntel backend and explains how to perform manual database rollbacks.

> [!NOTE]
> Flyway Community Edition does not support automatic rollback (`undo` migrations). Rollbacks must be executed manually against the database, followed by updating Flyway's schema history table.

---

## 1. Migration Overview

All migration files are located under [src/main/resources/db/migration](file:///c:/Users/2987/ShipIntel/shipintel/backend/src/main/resources/db/migration).

| Version | File Name | Description |
| :--- | :--- | :--- |
| `V1` | [V1__create_couriers.sql](file:///c:/Users/2987/ShipIntel/shipintel/backend/src/main/resources/db/migration/V1__create_couriers.sql) | Creates the `couriers` table, unique index/constraint on `name`, audit column trigger function `update_updated_at_column()`, and the update trigger. |
| `V2` | [V2__create_coverage_areas.sql](file:///c:/Users/2987/ShipIntel/shipintel/backend/src/main/resources/db/migration/V2__create_coverage_areas.sql) | Creates the `coverage_areas` table and its update trigger. |
| `V3` | [V3__create_courier_coverage_areas.sql](file:///c:/Users/2987/ShipIntel/shipintel/backend/src/main/resources/db/migration/V3__create_courier_coverage_areas.sql) | Creates the join table `courier_coverage_areas` with cascade delete. |
| `V4` | [V4__create_courier_services.sql](file:///c:/Users/2987/ShipIntel/shipintel/backend/src/main/resources/db/migration/V4__create_courier_services.sql) | Creates the `courier_services` table with `transport_mode` CHECK constraint, indexes, and trigger. |
| `V5` | [V5__create_freight_rates.sql](file:///c:/Users/2987/ShipIntel/shipintel/backend/src/main/resources/db/migration/V5__create_freight_rates.sql) | Creates the `freight_rates` table with CHECK constraints (weights, costs, days, currency), lookup indexes, and trigger. |
| `V6` | [V6__create_article_categories.sql](file:///c:/Users/2987/ShipIntel/shipintel/backend/src/main/resources/db/migration/V6__create_article_categories.sql) | Creates the `article_categories` table and its trigger. |
| `V7` | [V7__create_articles.sql](file:///c:/Users/2987/ShipIntel/shipintel/backend/src/main/resources/db/migration/V7__create_articles.sql) | Creates the `articles` table, slug unique index, publication index, and trigger. |
| `V8` | [V8__create_newsletter_subscribers.sql](file:///c:/Users/2987/ShipIntel/shipintel/backend/src/main/resources/db/migration/V8__create_newsletter_subscribers.sql) | Creates the `newsletter_subscribers` table with `status` CHECK constraint, index, and trigger. |
| `V9` | [V9__create_contact_requests.sql](file:///c:/Users/2987/ShipIntel/shipintel/backend/src/main/resources/db/migration/V9__create_contact_requests.sql) | Creates the `contact_requests` table with CHECK constraints, status index, and trigger. |
| `V10` | [V10__seed_data.sql](file:///c:/Users/2987/ShipIntel/shipintel/backend/src/main/resources/db/migration/V10__seed_data.sql) | Seeds development data including Indian couriers (Delhivery, DTDC, Blue Dart, India Post, XpressBees), services, zones, sample rates, and resource articles. |

---

## 2. General Rollback Process

To manually roll back migrations, follow these steps:

1. **Execute the Rollback SQL**: Run the corresponding SQL drop or delete scripts (defined below) in descending version order.
2. **Clean Flyway Schema History**: Flyway tracks applied migrations in the `flyway_schema_history` table. You must delete the corresponding migration rows to prevent Flyway from assuming they are still active.
   ```sql
   DELETE FROM flyway_schema_history WHERE version = 'X';
   ```

---

## 3. Step-by-Step Rollback Scripts

### Rollback `V10` (Seed Data)
This deletes the seeded data from all tables.
```sql
TRUNCATE TABLE 
    courier_coverage_areas, 
    freight_rates, 
    courier_services, 
    couriers, 
    coverage_areas, 
    articles, 
    article_categories 
    CASCADE;

-- Update Flyway History
DELETE FROM flyway_schema_history WHERE version = '10';
```

### Rollback `V9` (Contact Requests)
```sql
DROP TRIGGER IF EXISTS trigger_update_contact_requests_updated_at ON contact_requests;
DROP TABLE IF EXISTS contact_requests;

-- Update Flyway History
DELETE FROM flyway_schema_history WHERE version = '9';
```

### Rollback `V8` (Newsletter Subscribers)
```sql
DROP TRIGGER IF EXISTS trigger_update_newsletter_subscribers_updated_at ON newsletter_subscribers;
DROP TABLE IF EXISTS newsletter_subscribers;

-- Update Flyway History
DELETE FROM flyway_schema_history WHERE version = '8';
```

### Rollback `V7` (Articles)
```sql
DROP TRIGGER IF EXISTS trigger_update_articles_updated_at ON articles;
DROP TABLE IF EXISTS articles;

-- Update Flyway History
DELETE FROM flyway_schema_history WHERE version = '7';
```

### Rollback `V6` (Article Categories)
```sql
DROP TRIGGER IF EXISTS trigger_update_article_categories_updated_at ON article_categories;
DROP TABLE IF EXISTS article_categories;

-- Update Flyway History
DELETE FROM flyway_schema_history WHERE version = '6';
```

### Rollback `V5` (Freight Rates)
```sql
DROP TRIGGER IF EXISTS trigger_update_freight_rates_updated_at ON freight_rates;
DROP TABLE IF EXISTS freight_rates;

-- Update Flyway History
DELETE FROM flyway_schema_history WHERE version = '5';
```

### Rollback `V4` (Courier Services)
```sql
DROP TRIGGER IF EXISTS trigger_update_courier_services_updated_at ON courier_services;
DROP TABLE IF EXISTS courier_services;

-- Update Flyway History
DELETE FROM flyway_schema_history WHERE version = '4';
```

### Rollback `V3` (Courier Coverage Areas)
```sql
DROP TABLE IF EXISTS courier_coverage_areas;

-- Update Flyway History
DELETE FROM flyway_schema_history WHERE version = '3';
```

### Rollback `V2` (Coverage Areas)
```sql
DROP TRIGGER IF EXISTS trigger_update_coverage_areas_updated_at ON coverage_areas;
DROP TABLE IF EXISTS coverage_areas;

-- Update Flyway History
DELETE FROM flyway_schema_history WHERE version = '2';
```

### Rollback `V1` (Couriers & Audit Utility)
```sql
DROP TRIGGER IF EXISTS trigger_update_couriers_updated_at ON couriers;
DROP TABLE IF EXISTS couriers;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Update Flyway History
DELETE FROM flyway_schema_history WHERE version = '1';
```
