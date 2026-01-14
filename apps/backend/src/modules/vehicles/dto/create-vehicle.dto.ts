import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { VehicleStatus } from '@prisma/client';

export class CreateVehicleDto {
  @ApiProperty({ example: 'AB123CD', description: 'Targa del veicolo' })
  @IsString()
  plate: string;

  @ApiProperty({ example: 'Iveco', description: 'Marca del veicolo' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'Stralis', description: 'Modello del veicolo' })
  @IsString()
  model: string;

  @ApiProperty({ example: 2021, description: 'Anno di immatricolazione' })
  @IsInt()
  @Min(1990)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @ApiPropertyOptional({
    enum: VehicleStatus,
    default: 'available',
    description: 'Stato del veicolo',
  })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @ApiPropertyOptional({ description: 'ID autista assegnato' })
  @IsOptional()
  @IsString()
  currentDriverId?: string;

  @ApiPropertyOptional({ example: 45.4642, description: 'Latitudine ultima posizione' })
  @IsOptional()
  @IsNumber()
  lastLat?: number;

  @ApiPropertyOptional({ example: 9.19, description: 'Longitudine ultima posizione' })
  @IsOptional()
  @IsNumber()
  lastLng?: number;

  @ApiProperty({ example: 150000, description: 'Chilometri totali' })
  @IsInt()
  @Min(0)
  kmTotal: number;

  @ApiProperty({ example: '2025-12-31', description: 'Scadenza assicurazione' })
  @IsDateString()
  insuranceExpiry: string;

  @ApiProperty({ example: '2025-06-30', description: 'Scadenza revisione' })
  @IsDateString()
  revisionExpiry: string;

  @ApiPropertyOptional({ description: 'Note aggiuntive' })
  @IsOptional()
  @IsString()
  notes?: string;
}
