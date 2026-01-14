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
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@ApiTags('drivers')
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  @ApiOperation({ summary: 'Ottieni tutti gli autisti' })
  @ApiResponse({ status: 200, description: 'Lista di tutti gli autisti' })
  findAll() {
    return this.driversService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ottieni un autista per ID' })
  @ApiParam({ name: 'id', description: 'ID autista' })
  @ApiResponse({ status: 200, description: 'Autista trovato' })
  @ApiResponse({ status: 404, description: 'Autista non trovato' })
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un nuovo autista' })
  @ApiResponse({ status: 201, description: 'Autista creato con successo' })
  @ApiResponse({ status: 400, description: 'Dati non validi' })
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Aggiorna un autista' })
  @ApiParam({ name: 'id', description: 'ID autista' })
  @ApiResponse({ status: 200, description: 'Autista aggiornato' })
  @ApiResponse({ status: 404, description: 'Autista non trovato' })
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Elimina un autista' })
  @ApiParam({ name: 'id', description: 'ID autista' })
  @ApiResponse({ status: 204, description: 'Autista eliminato' })
  @ApiResponse({ status: 404, description: 'Autista non trovato' })
  remove(@Param('id') id: string) {
    return this.driversService.remove(id);
  }
}
