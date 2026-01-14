import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsDateString,
} from 'class-validator';
import { DriverStatus } from '@prisma/client';

export class CreateDriverDto {
  @ApiProperty({ example: 'Marco', description: 'Nome' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Rossi', description: 'Cognome' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'RSSMRC80A01H501Z', description: 'Codice fiscale' })
  @IsString()
  fiscalCode: string;

  @ApiProperty({ example: '+39 333 1234567', description: 'Telefono' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: 'marco.rossi@email.com', description: 'Email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'MI12345678', description: 'Numero patente' })
  @IsString()
  licenseNumber: string;

  @ApiProperty({ example: '2026-12-31', description: 'Scadenza patente' })
  @IsDateString()
  licenseExpiry: string;

  @ApiProperty({ example: '2025-06-30', description: 'Scadenza CQC' })
  @IsDateString()
  cqcExpiry: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Scadenza ADR' })
  @IsOptional()
  @IsDateString()
  adrExpiry?: string;

  @ApiPropertyOptional({
    enum: DriverStatus,
    default: 'active',
    description: 'Stato autista',
  })
  @IsOptional()
  @IsEnum(DriverStatus)
  status?: DriverStatus;

  @ApiPropertyOptional({ description: 'ID veicolo assegnato' })
  @IsOptional()
  @IsString()
  assignedVehicleId?: string;

  @ApiProperty({ example: '2020-01-15', description: 'Data assunzione' })
  @IsDateString()
  hireDate: string;

  @ApiPropertyOptional({ description: 'Note aggiuntive' })
  @IsOptional()
  @IsString()
  notes?: string;
}
