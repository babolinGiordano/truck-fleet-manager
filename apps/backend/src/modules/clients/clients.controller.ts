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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Ottieni tutti i clienti' })
  @ApiResponse({ status: 200, description: 'Lista di tutti i clienti' })
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ottieni un cliente per ID' })
  @ApiParam({ name: 'id', description: 'ID cliente' })
  @ApiResponse({ status: 200, description: 'Cliente trovato' })
  @ApiResponse({ status: 404, description: 'Cliente non trovato' })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un nuovo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creato con successo' })
  @ApiResponse({ status: 400, description: 'Dati non validi' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Aggiorna un cliente' })
  @ApiParam({ name: 'id', description: 'ID cliente' })
  @ApiResponse({ status: 200, description: 'Cliente aggiornato' })
  @ApiResponse({ status: 404, description: 'Cliente non trovato' })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Elimina un cliente' })
  @ApiParam({ name: 'id', description: 'ID cliente' })
  @ApiResponse({ status: 204, description: 'Cliente eliminato' })
  @ApiResponse({ status: 404, description: 'Cliente non trovato' })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
