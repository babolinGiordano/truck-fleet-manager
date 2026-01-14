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
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  @ApiOperation({ summary: 'Ottieni tutti i viaggi' })
  @ApiResponse({ status: 200, description: 'Lista di tutti i viaggi' })
  findAll() {
    return this.tripsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ottieni un viaggio per ID' })
  @ApiParam({ name: 'id', description: 'ID viaggio' })
  @ApiResponse({ status: 200, description: 'Viaggio trovato' })
  @ApiResponse({ status: 404, description: 'Viaggio non trovato' })
  findOne(@Param('id') id: string) {
    return this.tripsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un nuovo viaggio' })
  @ApiResponse({ status: 201, description: 'Viaggio creato con successo' })
  @ApiResponse({ status: 400, description: 'Dati non validi' })
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripsService.create(createTripDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Aggiorna un viaggio' })
  @ApiParam({ name: 'id', description: 'ID viaggio' })
  @ApiResponse({ status: 200, description: 'Viaggio aggiornato' })
  @ApiResponse({ status: 404, description: 'Viaggio non trovato' })
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    return this.tripsService.update(id, updateTripDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Elimina un viaggio' })
  @ApiParam({ name: 'id', description: 'ID viaggio' })
  @ApiResponse({ status: 204, description: 'Viaggio eliminato' })
  @ApiResponse({ status: 404, description: 'Viaggio non trovato' })
  remove(@Param('id') id: string) {
    return this.tripsService.remove(id);
  }
}
