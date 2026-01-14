import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException(`Veicolo con ID ${id} non trovato`);
    }

    return vehicle;
  }

  async create(createVehicleDto: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: {
        ...createVehicleDto,
        insuranceExpiry: new Date(createVehicleDto.insuranceExpiry),
        revisionExpiry: new Date(createVehicleDto.revisionExpiry),
        lastPositionAt: createVehicleDto.lastLat ? new Date() : undefined,
      },
    });
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    await this.findOne(id);

    const data: any = { ...updateVehicleDto };
    if (updateVehicleDto.insuranceExpiry) {
      data.insuranceExpiry = new Date(updateVehicleDto.insuranceExpiry);
    }
    if (updateVehicleDto.revisionExpiry) {
      data.revisionExpiry = new Date(updateVehicleDto.revisionExpiry);
    }
    if (updateVehicleDto.lastLat !== undefined) {
      data.lastPositionAt = new Date();
    }

    return this.prisma.vehicle.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.vehicle.delete({
      where: { id },
    });
  }
}
