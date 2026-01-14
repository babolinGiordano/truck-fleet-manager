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
import { FuelService } from './fuel.service';
import { CreateFuelDto } from './dto/create-fuel.dto';
import { UpdateFuelDto } from './dto/update-fuel.dto';

@ApiTags('fuel')
@Controller('fuel')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @Get()
  @ApiOperation({ summary: 'Ottieni tutti i rifornimenti' })
  @ApiResponse({ status: 200, description: 'Lista di tutti i rifornimenti' })
  findAll() {
    return this.fuelService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ottieni un rifornimento per ID' })
  @ApiParam({ name: 'id', description: 'ID rifornimento' })
  @ApiResponse({ status: 200, description: 'Rifornimento trovato' })
  @ApiResponse({ status: 404, description: 'Rifornimento non trovato' })
  findOne(@Param('id') id: string) {
    return this.fuelService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un nuovo rifornimento' })
  @ApiResponse({ status: 201, description: 'Rifornimento creato con successo' })
  @ApiResponse({ status: 400, description: 'Dati non validi' })
  create(@Body() createFuelDto: CreateFuelDto) {
    return this.fuelService.create(createFuelDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Aggiorna un rifornimento' })
  @ApiParam({ name: 'id', description: 'ID rifornimento' })
  @ApiResponse({ status: 200, description: 'Rifornimento aggiornato' })
  @ApiResponse({ status: 404, description: 'Rifornimento non trovato' })
  update(@Param('id') id: string, @Body() updateFuelDto: UpdateFuelDto) {
    return this.fuelService.update(id, updateFuelDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Elimina un rifornimento' })
  @ApiParam({ name: 'id', description: 'ID rifornimento' })
  @ApiResponse({ status: 204, description: 'Rifornimento eliminato' })
  @ApiResponse({ status: 404, description: 'Rifornimento non trovato' })
  remove(@Param('id') id: string) {
    return this.fuelService.remove(id);
  }
}
