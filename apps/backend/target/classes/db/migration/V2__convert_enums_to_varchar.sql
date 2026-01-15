-- Migration: Convert PostgreSQL native enums to varchar for JPA/Hibernate compatibility
-- This simplifies the Java code by allowing standard @Enumerated(EnumType.STRING)
-- Values are converted to UPPERCASE to match Java enum names

-- Step 1: Drop DEFAULT constraints that depend on enum types
ALTER TABLE drivers ALTER COLUMN status DROP DEFAULT;
ALTER TABLE vehicles ALTER COLUMN status DROP DEFAULT;
ALTER TABLE trips ALTER COLUMN status DROP DEFAULT;
ALTER TABLE invoices ALTER COLUMN status DROP DEFAULT;
ALTER TABLE fuel_records ALTER COLUMN "fuelType" DROP DEFAULT;
ALTER TABLE maintenance_records ALTER COLUMN type DROP DEFAULT;
ALTER TABLE maintenance_records ALTER COLUMN status DROP DEFAULT;

-- Step 2: Convert columns from enum to varchar with uppercase values
ALTER TABLE drivers ALTER COLUMN status TYPE varchar(20) USING UPPER(status::text);
ALTER TABLE vehicles ALTER COLUMN status TYPE varchar(20) USING UPPER(status::text);
ALTER TABLE trips ALTER COLUMN status TYPE varchar(20) USING UPPER(status::text);
ALTER TABLE invoices ALTER COLUMN status TYPE varchar(20) USING UPPER(status::text);
ALTER TABLE fuel_records ALTER COLUMN "fuelType" TYPE varchar(20) USING UPPER("fuelType"::text);
ALTER TABLE maintenance_records ALTER COLUMN type TYPE varchar(20) USING UPPER(type::text);
ALTER TABLE maintenance_records ALTER COLUMN status TYPE varchar(20) USING UPPER(status::text);

-- Step 3: Re-add DEFAULT constraints with uppercase varchar values
ALTER TABLE drivers ALTER COLUMN status SET DEFAULT 'ACTIVE';
ALTER TABLE vehicles ALTER COLUMN status SET DEFAULT 'AVAILABLE';
ALTER TABLE trips ALTER COLUMN status SET DEFAULT 'PLANNED';
ALTER TABLE invoices ALTER COLUMN status SET DEFAULT 'DRAFT';
ALTER TABLE fuel_records ALTER COLUMN "fuelType" SET DEFAULT 'DIESEL';
ALTER TABLE maintenance_records ALTER COLUMN status SET DEFAULT 'SCHEDULED';

-- Step 4: Drop the native enum types (no longer needed)
DROP TYPE IF EXISTS "DriverStatus";
DROP TYPE IF EXISTS "VehicleStatus";
DROP TYPE IF EXISTS "TripStatus";
DROP TYPE IF EXISTS "InvoiceStatus";
DROP TYPE IF EXISTS "FuelType";
DROP TYPE IF EXISTS "MaintenanceType";
DROP TYPE IF EXISTS "MaintenanceStatus";
