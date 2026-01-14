import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const trips = await this.prisma.trip.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: true,
        driver: true,
        client: true,
      },
    });

    return trips.map(this.mapTripToResponse);
  }

  async findOne(id: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        vehicle: true,
        driver: true,
        client: true,
      },
    });

    if (!trip) {
      throw new NotFoundException(`Viaggio con ID ${id} non trovato`);
    }

    return this.mapTripToResponse(trip);
  }

  async create(createTripDto: CreateTripDto) {
    const trip = await this.prisma.trip.create({
      data: {
        tripNumber: createTripDto.tripNumber,
        vehicleId: createTripDto.vehicleId,
        driverId: createTripDto.driverId,
        clientId: createTripDto.clientId,
        // Origin
        originCompany: createTripDto.origin.companyName,
        originAddress: createTripDto.origin.address,
        originCity: createTripDto.origin.city,
        originProvince: createTripDto.origin.province,
        originPostalCode: createTripDto.origin.postalCode,
        originCountry: createTripDto.origin.country || 'Italia',
        originLat: createTripDto.origin.lat,
        originLng: createTripDto.origin.lng,
        // Destination
        destCompany: createTripDto.destination.companyName,
        destAddress: createTripDto.destination.address,
        destCity: createTripDto.destination.city,
        destProvince: createTripDto.destination.province,
        destPostalCode: createTripDto.destination.postalCode,
        destCountry: createTripDto.destination.country || 'Italia',
        destLat: createTripDto.destination.lat,
        destLng: createTripDto.destination.lng,
        // Cargo
        cargoDescription: createTripDto.cargo.description,
        cargoWeight: createTripDto.cargo.weight,
        cargoVolume: createTripDto.cargo.volume,
        cargoPackages: createTripDto.cargo.packages,
        cargoIsADR: createTripDto.cargo.isADR || false,
        cargoTemperature: createTripDto.cargo.temperature,
        // Dates and other
        status: createTripDto.status,
        plannedDeparture: new Date(createTripDto.plannedDeparture),
        actualDeparture: createTripDto.actualDeparture
          ? new Date(createTripDto.actualDeparture)
          : undefined,
        plannedArrival: new Date(createTripDto.plannedArrival),
        actualArrival: createTripDto.actualArrival
          ? new Date(createTripDto.actualArrival)
          : undefined,
        kmPlanned: createTripDto.kmPlanned,
        kmActual: createTripDto.kmActual,
        price: createTripDto.price,
        notes: createTripDto.notes,
      },
      include: {
        vehicle: true,
        driver: true,
        client: true,
      },
    });

    return this.mapTripToResponse(trip);
  }

  async update(id: string, updateTripDto: UpdateTripDto) {
    await this.findOne(id);

    const data: any = {};

    // Handle origin updates
    if (updateTripDto.origin) {
      if (updateTripDto.origin.companyName !== undefined)
        data.originCompany = updateTripDto.origin.companyName;
      if (updateTripDto.origin.address !== undefined)
        data.originAddress = updateTripDto.origin.address;
      if (updateTripDto.origin.city !== undefined)
        data.originCity = updateTripDto.origin.city;
      if (updateTripDto.origin.province !== undefined)
        data.originProvince = updateTripDto.origin.province;
      if (updateTripDto.origin.postalCode !== undefined)
        data.originPostalCode = updateTripDto.origin.postalCode;
      if (updateTripDto.origin.country !== undefined)
        data.originCountry = updateTripDto.origin.country;
      if (updateTripDto.origin.lat !== undefined)
        data.originLat = updateTripDto.origin.lat;
      if (updateTripDto.origin.lng !== undefined)
        data.originLng = updateTripDto.origin.lng;
    }

    // Handle destination updates
    if (updateTripDto.destination) {
      if (updateTripDto.destination.companyName !== undefined)
        data.destCompany = updateTripDto.destination.companyName;
      if (updateTripDto.destination.address !== undefined)
        data.destAddress = updateTripDto.destination.address;
      if (updateTripDto.destination.city !== undefined)
        data.destCity = updateTripDto.destination.city;
      if (updateTripDto.destination.province !== undefined)
        data.destProvince = updateTripDto.destination.province;
      if (updateTripDto.destination.postalCode !== undefined)
        data.destPostalCode = updateTripDto.destination.postalCode;
      if (updateTripDto.destination.country !== undefined)
        data.destCountry = updateTripDto.destination.country;
      if (updateTripDto.destination.lat !== undefined)
        data.destLat = updateTripDto.destination.lat;
      if (updateTripDto.destination.lng !== undefined)
        data.destLng = updateTripDto.destination.lng;
    }

    // Handle cargo updates
    if (updateTripDto.cargo) {
      if (updateTripDto.cargo.description !== undefined)
        data.cargoDescription = updateTripDto.cargo.description;
      if (updateTripDto.cargo.weight !== undefined)
        data.cargoWeight = updateTripDto.cargo.weight;
      if (updateTripDto.cargo.volume !== undefined)
        data.cargoVolume = updateTripDto.cargo.volume;
      if (updateTripDto.cargo.packages !== undefined)
        data.cargoPackages = updateTripDto.cargo.packages;
      if (updateTripDto.cargo.isADR !== undefined)
        data.cargoIsADR = updateTripDto.cargo.isADR;
      if (updateTripDto.cargo.temperature !== undefined)
        data.cargoTemperature = updateTripDto.cargo.temperature;
    }

    // Handle other fields
    if (updateTripDto.tripNumber !== undefined)
      data.tripNumber = updateTripDto.tripNumber;
    if (updateTripDto.vehicleId !== undefined)
      data.vehicleId = updateTripDto.vehicleId;
    if (updateTripDto.driverId !== undefined)
      data.driverId = updateTripDto.driverId;
    if (updateTripDto.clientId !== undefined)
      data.clientId = updateTripDto.clientId;
    if (updateTripDto.status !== undefined) data.status = updateTripDto.status;
    if (updateTripDto.plannedDeparture !== undefined)
      data.plannedDeparture = new Date(updateTripDto.plannedDeparture);
    if (updateTripDto.actualDeparture !== undefined)
      data.actualDeparture = new Date(updateTripDto.actualDeparture);
    if (updateTripDto.plannedArrival !== undefined)
      data.plannedArrival = new Date(updateTripDto.plannedArrival);
    if (updateTripDto.actualArrival !== undefined)
      data.actualArrival = new Date(updateTripDto.actualArrival);
    if (updateTripDto.kmPlanned !== undefined)
      data.kmPlanned = updateTripDto.kmPlanned;
    if (updateTripDto.kmActual !== undefined)
      data.kmActual = updateTripDto.kmActual;
    if (updateTripDto.price !== undefined) data.price = updateTripDto.price;
    if (updateTripDto.notes !== undefined) data.notes = updateTripDto.notes;

    const trip = await this.prisma.trip.update({
      where: { id },
      data,
      include: {
        vehicle: true,
        driver: true,
        client: true,
      },
    });

    return this.mapTripToResponse(trip);
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.trip.delete({
      where: { id },
    });
  }

  private mapTripToResponse(trip: any) {
    return {
      id: trip.id,
      tripNumber: trip.tripNumber,
      vehicleId: trip.vehicleId,
      driverId: trip.driverId,
      clientId: trip.clientId,
      origin: {
        companyName: trip.originCompany,
        address: trip.originAddress,
        city: trip.originCity,
        province: trip.originProvince,
        postalCode: trip.originPostalCode,
        country: trip.originCountry,
        lat: trip.originLat,
        lng: trip.originLng,
      },
      destination: {
        companyName: trip.destCompany,
        address: trip.destAddress,
        city: trip.destCity,
        province: trip.destProvince,
        postalCode: trip.destPostalCode,
        country: trip.destCountry,
        lat: trip.destLat,
        lng: trip.destLng,
      },
      cargo: {
        description: trip.cargoDescription,
        weight: trip.cargoWeight,
        volume: trip.cargoVolume,
        packages: trip.cargoPackages,
        isADR: trip.cargoIsADR,
        temperature: trip.cargoTemperature,
      },
      status: trip.status,
      plannedDeparture: trip.plannedDeparture.toISOString(),
      actualDeparture: trip.actualDeparture?.toISOString(),
      plannedArrival: trip.plannedArrival.toISOString(),
      actualArrival: trip.actualArrival?.toISOString(),
      kmPlanned: trip.kmPlanned,
      kmActual: trip.kmActual,
      price: Number(trip.price),
      notes: trip.notes,
      createdAt: trip.createdAt.toISOString(),
      updatedAt: trip.updatedAt.toISOString(),
      vehicle: trip.vehicle,
      driver: trip.driver,
      client: trip.client,
    };
  }
}
