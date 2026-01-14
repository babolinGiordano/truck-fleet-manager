import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsInt,
  IsBoolean,
  IsDateString,
  ValidateNested,
  Min,
} from 'class-validator';
import { TripStatus } from '@prisma/client';

export class TripLocationDto {
  @ApiPropertyOptional({ example: 'Magazzino Nord', description: 'Nome azienda/luogo' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ example: 'Via Industria 45', description: 'Indirizzo' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Milano', description: 'Città' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'MI', description: 'Provincia' })
  @IsString()
  province: string;

  @ApiProperty({ example: '20100', description: 'CAP' })
  @IsString()
  postalCode: string;

  @ApiPropertyOptional({ example: 'Italia', default: 'Italia', description: 'Paese' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 45.4642, description: 'Latitudine' })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ example: 9.19, description: 'Longitudine' })
  @IsOptional()
  @IsNumber()
  lng?: number;
}

export class CargoInfoDto {
  @ApiProperty({ example: 'Materiale elettronico', description: 'Descrizione carico' })
  @IsString()
  description: string;

  @ApiProperty({ example: 5000, description: 'Peso in kg' })
  @IsNumber()
  @Min(0)
  weight: number;

  @ApiPropertyOptional({ example: 25, description: 'Volume in m³' })
  @IsOptional()
  @IsNumber()
  volume?: number;

  @ApiPropertyOptional({ example: 10, description: 'Numero colli' })
  @IsOptional()
  @IsInt()
  packages?: number;

  @ApiPropertyOptional({ default: false, description: 'Merce ADR (pericolosa)' })
  @IsOptional()
  @IsBoolean()
  isADR?: boolean;

  @ApiPropertyOptional({ example: -18, description: 'Temperatura richiesta (°C)' })
  @IsOptional()
  @IsNumber()
  temperature?: number;
}

export class CreateTripDto {
  @ApiProperty({ example: 'VG-2024-001', description: 'Numero viaggio' })
  @IsString()
  tripNumber: string;

  @ApiProperty({ description: 'ID veicolo' })
  @IsString()
  vehicleId: string;

  @ApiProperty({ description: 'ID autista' })
  @IsString()
  driverId: string;

  @ApiProperty({ description: 'ID cliente' })
  @IsString()
  clientId: string;

  @ApiProperty({ type: TripLocationDto, description: 'Luogo di partenza' })
  @ValidateNested()
  @Type(() => TripLocationDto)
  origin: TripLocationDto;

  @ApiProperty({ type: TripLocationDto, description: 'Luogo di destinazione' })
  @ValidateNested()
  @Type(() => TripLocationDto)
  destination: TripLocationDto;

  @ApiProperty({ type: CargoInfoDto, description: 'Informazioni carico' })
  @ValidateNested()
  @Type(() => CargoInfoDto)
  cargo: CargoInfoDto;

  @ApiPropertyOptional({
    enum: TripStatus,
    default: 'planned',
    description: 'Stato viaggio',
  })
  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus;

  @ApiProperty({ example: '2024-12-01T08:00:00Z', description: 'Partenza pianificata' })
  @IsDateString()
  plannedDeparture: string;

  @ApiPropertyOptional({ description: 'Partenza effettiva' })
  @IsOptional()
  @IsDateString()
  actualDeparture?: string;

  @ApiProperty({ example: '2024-12-01T18:00:00Z', description: 'Arrivo pianificato' })
  @IsDateString()
  plannedArrival: string;

  @ApiPropertyOptional({ description: 'Arrivo effettivo' })
  @IsOptional()
  @IsDateString()
  actualArrival?: string;

  @ApiProperty({ example: 500, description: 'Km pianificati' })
  @IsInt()
  @Min(0)
  kmPlanned: number;

  @ApiPropertyOptional({ description: 'Km effettivi' })
  @IsOptional()
  @IsInt()
  kmActual?: number;

  @ApiProperty({ example: 850.50, description: 'Prezzo trasporto (€)' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'Note aggiuntive' })
  @IsOptional()
  @IsString()
  notes?: string;
}
