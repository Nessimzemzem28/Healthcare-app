import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, BadRequestException, ParseIntPipe, Query } from '@nestjs/common';
import { PatientService } from './patient.service';
import { Patient } from '@prisma/client';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  async findAll(): Promise<Patient[]> {
    return this.patientService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Patient> {
    const patient = await this.patientService.findOne(id);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    try {
      return await this.patientService.create(createPatientDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePatientDto: UpdatePatientDto): Promise<Patient> {
    try {
      return await this.patientService.update(id, updatePatientDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Patient> {
    try {
      return await this.patientService.remove(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('search/fullname')
  async searchByFullName(@Query('fullname') fullName: string) {
    return this.patientService.searchByFullName(fullName);
  }

  
  @Get('search/firstname')
  async searchByFirstName(@Query('firstname') firstName: string) {
    return this.patientService.searchByFirstName(firstName);
  }

  
  @Get('search/lastname')
  async searchByLastName(@Query('lastname') lastName: string) {
    return this.patientService.searchByLastName(lastName);
  }
}
