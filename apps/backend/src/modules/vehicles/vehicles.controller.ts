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
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'Ottieni tutti i veicoli' })
  @ApiResponse({ status: 200, description: 'Lista di tutti i veicoli' })
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ottieni un veicolo per ID' })
  @ApiParam({ name: 'id', description: 'ID del veicolo' })
  @ApiResponse({ status: 200, description: 'Veicolo trovato' })
  @ApiResponse({ status: 404, description: 'Veicolo non trovato' })
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un nuovo veicolo' })
  @ApiResponse({ status: 201, description: 'Veicolo creato con successo' })
  @ApiResponse({ status: 400, description: 'Dati non validi' })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Aggiorna un veicolo' })
  @ApiParam({ name: 'id', description: 'ID del veicolo' })
  @ApiResponse({ status: 200, description: 'Veicolo aggiornato' })
  @ApiResponse({ status: 404, description: 'Veicolo non trovato' })
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Elimina un veicolo' })
  @ApiParam({ name: 'id', description: 'ID del veicolo' })
  @ApiResponse({ status: 204, description: 'Veicolo eliminato' })
  @ApiResponse({ status: 404, description: 'Veicolo non trovato' })
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}
