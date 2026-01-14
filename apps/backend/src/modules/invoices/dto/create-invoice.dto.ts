import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsInt,
  IsDateString,
  ValidateNested,
  IsArray,
  Min,
} from 'class-validator';
import { InvoiceStatus } from '@prisma/client';

export class InvoiceItemDto {
  @ApiProperty({ example: 'Trasporto Milano - Roma', description: 'Descrizione voce' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 1, default: 1, description: 'Quantità' })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiProperty({ example: 850.00, description: 'Prezzo unitario (€)' })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ example: 850.00, description: 'Prezzo totale voce (€)' })
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @ApiPropertyOptional({ description: 'ID viaggio associato' })
  @IsOptional()
  @IsString()
  tripId?: string;
}

export class CreateInvoiceDto {
  @ApiProperty({ example: 'FT-2024-001', description: 'Numero fattura' })
  @IsString()
  invoiceNumber: string;

  @ApiProperty({ description: 'ID cliente' })
  @IsString()
  clientId: string;

  @ApiProperty({ example: '2024-12-01', description: 'Data emissione' })
  @IsDateString()
  issueDate: string;

  @ApiProperty({ example: '2024-12-31', description: 'Data scadenza' })
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional({
    enum: InvoiceStatus,
    default: 'draft',
    description: 'Stato fattura',
  })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @ApiProperty({ type: [InvoiceItemDto], description: 'Voci fattura' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @ApiProperty({ example: 850.00, description: 'Imponibile (€)' })
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiPropertyOptional({ example: 22, default: 22, description: 'Aliquota IVA (%)' })
  @IsOptional()
  @IsNumber()
  vatRate?: number;

  @ApiProperty({ example: 187.00, description: 'Importo IVA (€)' })
  @IsNumber()
  @Min(0)
  vatAmount: number;

  @ApiProperty({ example: 1037.00, description: 'Totale fattura (€)' })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiPropertyOptional({ description: 'Note aggiuntive' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Data pagamento' })
  @IsOptional()
  @IsDateString()
  paidDate?: string;
}
