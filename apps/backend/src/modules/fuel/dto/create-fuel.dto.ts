import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsInt,
  IsBoolean,
  IsDateString,
  Min,
} from 'class-validator';
import { FuelType } from '@prisma/client';

export class CreateFuelDto {
  @ApiProperty({ description: 'ID veicolo' })
  @IsString()
  vehicleId: string;

  @ApiPropertyOptional({ description: 'ID autista' })
  @IsOptional()
  @IsString()
  driverId?: string;

  @ApiProperty({ example: '2024-12-01', description: 'Data rifornimento' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 350.5, description: 'Litri riforniti' })
  @IsNumber()
  @Min(0)
  liters: number;

  @ApiProperty({ example: 1.589, description: 'Prezzo al litro (€)' })
  @IsNumber()
  @Min(0)
  pricePerLiter: number;

  @ApiProperty({ example: 556.84, description: 'Costo totale (€)' })
  @IsNumber()
  @Min(0)
  totalCost: number;

  @ApiPropertyOptional({
    enum: FuelType,
    default: 'diesel',
    description: 'Tipo carburante',
  })
  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @ApiPropertyOptional({ example: 'ENI Via Roma', description: 'Nome stazione' })
  @IsOptional()
  @IsString()
  stationName?: string;

  @ApiProperty({ example: 245000, description: 'Lettura contachilometri' })
  @IsInt()
  @Min(0)
  odometer: number;

  @ApiPropertyOptional({ default: true, description: 'Pieno completo' })
  @IsOptional()
  @IsBoolean()
  fullTank?: boolean;

  @ApiPropertyOptional({ description: 'Note aggiuntive' })
  @IsOptional()
  @IsString()
  notes?: string;
}
