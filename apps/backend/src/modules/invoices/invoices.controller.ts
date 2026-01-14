import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @ApiOperation({ summary: 'Ottieni tutte le fatture' })
  @ApiResponse({ status: 200, description: 'Lista di tutte le fatture' })
  findAll() {
    return this.invoicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ottieni una fattura per ID' })
  @ApiParam({ name: 'id', description: 'ID fattura' })
  @ApiResponse({ status: 200, description: 'Fattura trovata' })
  @ApiResponse({ status: 404, description: 'Fattura non trovata' })
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea una nuova fattura' })
  @ApiResponse({ status: 201, description: 'Fattura creata con successo' })
  @ApiResponse({ status: 400, description: 'Dati non validi' })
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Aggiorna una fattura' })
  @ApiParam({ name: 'id', description: 'ID fattura' })
  @ApiResponse({ status: 200, description: 'Fattura aggiornata' })
  @ApiResponse({ status: 404, description: 'Fattura non trovata' })
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Elimina una fattura' })
  @ApiParam({ name: 'id', description: 'ID fattura' })
  @ApiResponse({ status: 204, description: 'Fattura eliminata' })
  @ApiResponse({ status: 404, description: 'Fattura non trovata' })
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(id);
  }
}
