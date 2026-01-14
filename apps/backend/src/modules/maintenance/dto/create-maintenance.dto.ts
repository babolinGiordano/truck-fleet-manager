import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsInt,
  IsDateString,
  Min,
} from 'class-validator';
import { MaintenanceType, MaintenanceStatus } from '@prisma/client';

export class CreateMaintenanceDto {
  @ApiProperty({ description: 'ID veicolo' })
  @IsString()
  vehicleId: string;

  @ApiProperty({
    enum: MaintenanceType,
    description: 'Tipo manutenzione',
  })
  @IsEnum(MaintenanceType)
  type: MaintenanceType;

  @ApiProperty({ example: 'Cambio olio motore e filtro', description: 'Descrizione' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2024-12-01', description: 'Data manutenzione' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 245000, description: 'Lettura contachilometri' })
  @IsInt()
  @Min(0)
  odometer: number;

  @ApiProperty({ example: 350.00, description: 'Costo (€)' })
  @IsNumber()
  @Min(0)
  cost: number;

  @ApiPropertyOptional({ example: 'Officina Rossi', description: 'Nome officina' })
  @IsOptional()
  @IsString()
  workshop?: string;

  @ApiPropertyOptional({ example: 'FT-2024-123', description: 'Numero fattura officina' })
  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @ApiPropertyOptional({ example: '2025-06-01', description: 'Prossima manutenzione' })
  @IsOptional()
  @IsDateString()
  nextMaintenanceDate?: string;

  @ApiPropertyOptional({ example: 260000, description: 'Prossima manutenzione (km)' })
  @IsOptional()
  @IsInt()
  nextMaintenanceKm?: number;

  @ApiPropertyOptional({
    enum: MaintenanceStatus,
    default: 'scheduled',
    description: 'Stato manutenzione',
  })
  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;

  @ApiPropertyOptional({ description: 'Note aggiuntive' })
  @IsOptional()
  @IsString()
  notes?: string;
}
