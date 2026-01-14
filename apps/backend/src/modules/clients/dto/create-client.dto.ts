import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'Trasporti SRL', description: 'Ragione sociale' })
  @IsString()
  companyName: string;

  @ApiProperty({ example: 'IT12345678901', description: 'Partita IVA' })
  @IsString()
  vatNumber: string;

  @ApiPropertyOptional({ example: 'ABCDEF12G34H567I', description: 'Codice fiscale' })
  @IsOptional()
  @IsString()
  fiscalCode?: string;

  @ApiProperty({ example: 'Via Roma 123', description: 'Indirizzo' })
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

  @ApiProperty({ example: '+39 02 1234567', description: 'Telefono' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'info@trasporti.it', description: 'Email' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'trasporti@pec.it', description: 'PEC' })
  @IsOptional()
  @IsEmail()
  pec?: string;

  @ApiPropertyOptional({ example: 'ABCD123', description: 'Codice SDI' })
  @IsOptional()
  @IsString()
  sdiCode?: string;

  @ApiPropertyOptional({ example: 'Mario Bianchi', description: 'Referente' })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiPropertyOptional({ description: 'Note aggiuntive' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ default: true, description: 'Cliente attivo' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
