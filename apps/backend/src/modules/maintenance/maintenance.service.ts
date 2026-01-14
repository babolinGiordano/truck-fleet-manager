import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const records = await this.prisma.maintenanceRecord.findMany({
      orderBy: { date: 'desc' },
      include: {
        vehicle: true,
      },
    });

    return records.map(this.mapMaintenanceToResponse);
  }

  async findOne(id: string) {
    const record = await this.prisma.maintenanceRecord.findUnique({
      where: { id },
      include: {
        vehicle: true,
      },
    });

    if (!record) {
      throw new NotFoundException(`Manutenzione con ID ${id} non trovata`);
    }

    return this.mapMaintenanceToResponse(record);
  }

  async create(createMaintenanceDto: CreateMaintenanceDto) {
    const record = await this.prisma.maintenanceRecord.create({
      data: {
        vehicleId: createMaintenanceDto.vehicleId,
        type: createMaintenanceDto.type,
        description: createMaintenanceDto.description,
        date: new Date(createMaintenanceDto.date),
        odometer: createMaintenanceDto.odometer,
        cost: createMaintenanceDto.cost,
        workshop: createMaintenanceDto.workshop,
        invoiceNumber: createMaintenanceDto.invoiceNumber,
        nextMaintenanceDate: createMaintenanceDto.nextMaintenanceDate
          ? new Date(createMaintenanceDto.nextMaintenanceDate)
          : undefined,
        nextMaintenanceKm: createMaintenanceDto.nextMaintenanceKm,
        status: createMaintenanceDto.status,
        notes: createMaintenanceDto.notes,
      },
      include: {
        vehicle: true,
      },
    });

    return this.mapMaintenanceToResponse(record);
  }

  async update(id: string, updateMaintenanceDto: UpdateMaintenanceDto) {
    await this.findOne(id);

    const data: any = { ...updateMaintenanceDto };
    if (updateMaintenanceDto.date) {
      data.date = new Date(updateMaintenanceDto.date);
    }
    if (updateMaintenanceDto.nextMaintenanceDate) {
      data.nextMaintenanceDate = new Date(updateMaintenanceDto.nextMaintenanceDate);
    }

    const record = await this.prisma.maintenanceRecord.update({
      where: { id },
      data,
      include: {
        vehicle: true,
      },
    });

    return this.mapMaintenanceToResponse(record);
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.maintenanceRecord.delete({
      where: { id },
    });
  }

  private mapMaintenanceToResponse(record: any) {
    return {
      id: record.id,
      vehicleId: record.vehicleId,
      type: record.type,
      description: record.description,
      date: record.date.toISOString().split('T')[0],
      odometer: record.odometer,
      cost: Number(record.cost),
      workshop: record.workshop,
      invoiceNumber: record.invoiceNumber,
      nextMaintenanceDate: record.nextMaintenanceDate?.toISOString().split('T')[0],
      nextMaintenanceKm: record.nextMaintenanceKm,
      status: record.status,
      notes: record.notes,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
      vehicle: record.vehicle,
    };
  }
}
