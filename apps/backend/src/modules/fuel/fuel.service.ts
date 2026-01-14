import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFuelDto } from './dto/create-fuel.dto';
import { UpdateFuelDto } from './dto/update-fuel.dto';

@Injectable()
export class FuelService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const records = await this.prisma.fuelRecord.findMany({
      orderBy: { date: 'desc' },
      include: {
        vehicle: true,
        driver: true,
      },
    });

    return records.map(this.mapFuelToResponse);
  }

  async findOne(id: string) {
    const record = await this.prisma.fuelRecord.findUnique({
      where: { id },
      include: {
        vehicle: true,
        driver: true,
      },
    });

    if (!record) {
      throw new NotFoundException(`Rifornimento con ID ${id} non trovato`);
    }

    return this.mapFuelToResponse(record);
  }

  async create(createFuelDto: CreateFuelDto) {
    const record = await this.prisma.fuelRecord.create({
      data: {
        vehicleId: createFuelDto.vehicleId,
        driverId: createFuelDto.driverId,
        date: new Date(createFuelDto.date),
        liters: createFuelDto.liters,
        pricePerLiter: createFuelDto.pricePerLiter,
        totalCost: createFuelDto.totalCost,
        fuelType: createFuelDto.fuelType,
        stationName: createFuelDto.stationName,
        odometer: createFuelDto.odometer,
        fullTank: createFuelDto.fullTank ?? true,
        notes: createFuelDto.notes,
      },
      include: {
        vehicle: true,
        driver: true,
      },
    });

    return this.mapFuelToResponse(record);
  }

  async update(id: string, updateFuelDto: UpdateFuelDto) {
    await this.findOne(id);

    const data: any = { ...updateFuelDto };
    if (updateFuelDto.date) {
      data.date = new Date(updateFuelDto.date);
    }

    const record = await this.prisma.fuelRecord.update({
      where: { id },
      data,
      include: {
        vehicle: true,
        driver: true,
      },
    });

    return this.mapFuelToResponse(record);
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.fuelRecord.delete({
      where: { id },
    });
  }

  private mapFuelToResponse(record: any) {
    return {
      id: record.id,
      vehicleId: record.vehicleId,
      driverId: record.driverId,
      date: record.date.toISOString().split('T')[0],
      liters: Number(record.liters),
      pricePerLiter: Number(record.pricePerLiter),
      totalCost: Number(record.totalCost),
      fuelType: record.fuelType,
      stationName: record.stationName,
      odometer: record.odometer,
      fullTank: record.fullTank,
      notes: record.notes,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
      vehicle: record.vehicle,
      driver: record.driver,
    };
  }
}
