import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, BadRequestException, ParseIntPipe, Res, InternalServerErrorException } from '@nestjs/common';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecord } from '@prisma/client';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { Response } from 'express';

@Controller('medical-records')
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  @Post()
  async create(@Body() createMedicalRecordDto: CreateMedicalRecordDto): Promise<MedicalRecord> {
    try {
      return await this.medicalRecordService.create(createMedicalRecordDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  
  @Get()
  async findAll(): Promise<MedicalRecord[]> {
    return this.medicalRecordService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MedicalRecord> {
    const medicalRecord = await this.medicalRecordService.findOne(id);
    if (!medicalRecord) {
      throw new NotFoundException(`Medical record with ID ${id} not found`);
    }
    return medicalRecord;
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateMedicalRecordDto: UpdateMedicalRecordDto): Promise<MedicalRecord> {
    try {
      return await this.medicalRecordService.update(id, updateMedicalRecordDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<MedicalRecord> {
    try {
      return await this.medicalRecordService.remove(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('patient/:patientId')
  async findByPatientId(@Param('patientId', ParseIntPipe) patientId: number): Promise<MedicalRecord []> {
    try {
      return this.medicalRecordService.findByPatientId(patientId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':patientId/pdf/:recordId')
  async downloadPDF(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Param('recordId', ParseIntPipe) recordId: number,
    @Res() res: Response,
  ) {
    const buffer = await this.medicalRecordService.generatePDF(patientId, recordId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="medical-record-${recordId}.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  /****************************************************************************************************************** */

  @Get('/stats/count-by-diagnosis-per-month')
  async getMedicalRecordsCountByDiagnosisPerMonth() {
    return this.medicalRecordService.getMedicalRecordsCountByDiagnosisPerMonth();
  }

  @Get('/stats/visit-type-count-per-month')
  async getMedicalRecordsCountByVisitTypePerMonth() {
    return await this.medicalRecordService.getMedicalRecordsCountByVisitTypePerMonth();
  }

}
