import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { ClientsModule } from './modules/clients/clients.module';
import { TripsModule } from './modules/trips/trips.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { FuelModule } from './modules/fuel/fuel.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    VehiclesModule,
    DriversModule,
    ClientsModule,
    TripsModule,
    InvoicesModule,
    FuelModule,
    MaintenanceModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
