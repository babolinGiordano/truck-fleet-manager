import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.driver.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { id },
    });

    if (!driver) {
      throw new NotFoundException(`Autista con ID ${id} non trovato`);
    }

    return driver;
  }

  async create(createDriverDto: CreateDriverDto) {
    return this.prisma.driver.create({
      data: {
        ...createDriverDto,
        licenseExpiry: new Date(createDriverDto.licenseExpiry),
        cqcExpiry: new Date(createDriverDto.cqcExpiry),
        adrExpiry: createDriverDto.adrExpiry
          ? new Date(createDriverDto.adrExpiry)
          : undefined,
        hireDate: new Date(createDriverDto.hireDate),
      },
    });
  }

  async update(id: string, updateDriverDto: UpdateDriverDto) {
    await this.findOne(id);

    const data: any = { ...updateDriverDto };
    if (updateDriverDto.licenseExpiry) {
      data.licenseExpiry = new Date(updateDriverDto.licenseExpiry);
    }
    if (updateDriverDto.cqcExpiry) {
      data.cqcExpiry = new Date(updateDriverDto.cqcExpiry);
    }
    if (updateDriverDto.adrExpiry) {
      data.adrExpiry = new Date(updateDriverDto.adrExpiry);
    }
    if (updateDriverDto.hireDate) {
      data.hireDate = new Date(updateDriverDto.hireDate);
    }

    return this.prisma.driver.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.driver.delete({
      where: { id },
    });
  }
}
