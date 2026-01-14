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
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@ApiTags('maintenance')
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get()
  @ApiOperation({ summary: 'Ottieni tutte le manutenzioni' })
  @ApiResponse({ status: 200, description: 'Lista di tutte le manutenzioni' })
  findAll() {
    return this.maintenanceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ottieni una manutenzione per ID' })
  @ApiParam({ name: 'id', description: 'ID manutenzione' })
  @ApiResponse({ status: 200, description: 'Manutenzione trovata' })
  @ApiResponse({ status: 404, description: 'Manutenzione non trovata' })
  findOne(@Param('id') id: string) {
    return this.maintenanceService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea una nuova manutenzione' })
  @ApiResponse({ status: 201, description: 'Manutenzione creata con successo' })
  @ApiResponse({ status: 400, description: 'Dati non validi' })
  create(@Body() createMaintenanceDto: CreateMaintenanceDto) {
    return this.maintenanceService.create(createMaintenanceDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Aggiorna una manutenzione' })
  @ApiParam({ name: 'id', description: 'ID manutenzione' })
  @ApiResponse({ status: 200, description: 'Manutenzione aggiornata' })
  @ApiResponse({ status: 404, description: 'Manutenzione non trovata' })
  update(
    @Param('id') id: string,
    @Body() updateMaintenanceDto: UpdateMaintenanceDto,
  ) {
    return this.maintenanceService.update(id, updateMaintenanceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Elimina una manutenzione' })
  @ApiParam({ name: 'id', description: 'ID manutenzione' })
  @ApiResponse({ status: 204, description: 'Manutenzione eliminata' })
  @ApiResponse({ status: 404, description: 'Manutenzione non trovata' })
  remove(@Param('id') id: string) {
    return this.maintenanceService.remove(id);
  }
}
