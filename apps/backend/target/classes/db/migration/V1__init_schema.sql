-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('available', 'in_transit', 'maintenance', 'inactive');

-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('active', 'on_leave', 'inactive');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('planned', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('diesel', 'gasoline', 'lpg', 'methane', 'electric');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('oil_change', 'tires', 'brakes', 'filters', 'revision', 'repair', 'other');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "status" "VehicleStatus" NOT NULL DEFAULT 'available',
    "currentDriverId" TEXT,
    "lastLat" DOUBLE PRECISION,
    "lastLng" DOUBLE PRECISION,
    "lastPositionAt" TIMESTAMP(3),
    "kmTotal" INTEGER NOT NULL DEFAULT 0,
    "insuranceExpiry" TIMESTAMP(3) NOT NULL,
    "revisionExpiry" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fiscalCode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "licenseNumber" TEXT NOT NULL,
    "licenseExpiry" TIMESTAMP(3) NOT NULL,
    "cqcExpiry" TIMESTAMP(3) NOT NULL,
    "adrExpiry" TIMESTAMP(3),
    "status" "DriverStatus" NOT NULL DEFAULT 'active',
    "assignedVehicleId" TEXT,
    "hireDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "vatNumber" TEXT NOT NULL,
    "fiscalCode" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Italia',
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pec" TEXT,
    "sdiCode" TEXT,
    "contactPerson" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "tripNumber" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "originCompany" TEXT,
    "originAddress" TEXT NOT NULL,
    "originCity" TEXT NOT NULL,
    "originProvince" TEXT NOT NULL,
    "originPostalCode" TEXT NOT NULL,
    "originCountry" TEXT NOT NULL DEFAULT 'Italia',
    "originLat" DOUBLE PRECISION,
    "originLng" DOUBLE PRECISION,
    "destCompany" TEXT,
    "destAddress" TEXT NOT NULL,
    "destCity" TEXT NOT NULL,
    "destProvince" TEXT NOT NULL,
    "destPostalCode" TEXT NOT NULL,
    "destCountry" TEXT NOT NULL DEFAULT 'Italia',
    "destLat" DOUBLE PRECISION,
    "destLng" DOUBLE PRECISION,
    "cargoDescription" TEXT NOT NULL,
    "cargoWeight" DOUBLE PRECISION NOT NULL,
    "cargoVolume" DOUBLE PRECISION,
    "cargoPackages" INTEGER,
    "cargoIsADR" BOOLEAN NOT NULL DEFAULT false,
    "cargoTemperature" DOUBLE PRECISION,
    "status" "TripStatus" NOT NULL DEFAULT 'planned',
    "plannedDeparture" TIMESTAMP(3) NOT NULL,
    "actualDeparture" TIMESTAMP(3),
    "plannedArrival" TIMESTAMP(3) NOT NULL,
    "actualArrival" TIMESTAMP(3),
    "kmPlanned" INTEGER NOT NULL,
    "kmActual" INTEGER,
    "price" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'draft',
    "subtotal" DECIMAL(10,2) NOT NULL,
    "vatRate" DECIMAL(5,2) NOT NULL DEFAULT 22,
    "vatAmount" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "paidDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "tripId" TEXT,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fuel_records" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "driverId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "liters" DECIMAL(10,2) NOT NULL,
    "pricePerLiter" DECIMAL(10,4) NOT NULL,
    "totalCost" DECIMAL(10,2) NOT NULL,
    "fuelType" "FuelType" NOT NULL DEFAULT 'diesel',
    "stationName" TEXT,
    "odometer" INTEGER NOT NULL,
    "fullTank" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fuel_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_records" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "type" "MaintenanceType" NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "odometer" INTEGER NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "workshop" TEXT,
    "invoiceNumber" TEXT,
    "nextMaintenanceDate" TIMESTAMP(3),
    "nextMaintenanceKm" INTEGER,
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenance_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_plate_key" ON "vehicles"("plate");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_fiscalCode_key" ON "drivers"("fiscalCode");

-- CreateIndex
CREATE UNIQUE INDEX "clients_vatNumber_key" ON "clients"("vatNumber");

-- CreateIndex
CREATE UNIQUE INDEX "trips_tripNumber_key" ON "trips"("tripNumber");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fuel_records" ADD CONSTRAINT "fuel_records_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fuel_records" ADD CONSTRAINT "fuel_records_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
