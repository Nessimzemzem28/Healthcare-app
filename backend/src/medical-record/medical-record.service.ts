import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { MedicalRecord } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PDFDocument, rgb } from 'pdf-lib';

@Injectable()
export class MedicalRecordService {
  constructor(private prisma: PrismaService) {}

  async create(createMedicalRecordDto: CreateMedicalRecordDto): Promise<MedicalRecord> {
    try {
      
      console.log("DTO Received:", createMedicalRecordDto);
  
      
      if (typeof createMedicalRecordDto.date === 'string') {
        createMedicalRecordDto.date = new Date(createMedicalRecordDto.date);
      }
  
      if (!(createMedicalRecordDto.date instanceof Date) || isNaN(createMedicalRecordDto.date.getTime())) {
        throw new BadRequestException('Invalid date format.');
      }
  
      const existingRecord = await this.prisma.medicalRecord.findFirst({
        where: {
          patientId: createMedicalRecordDto.patientId,
          date: createMedicalRecordDto.date,
        },
      });
  
      if (existingRecord) {
        throw new ConflictException('A medical record for this patient already exists on this date.');
      }
  
      const newMedicalRecord = await this.prisma.medicalRecord.create({
        data: {
          date: createMedicalRecordDto.date,
          diagnosis: createMedicalRecordDto.diagnosis,
          treatment: createMedicalRecordDto.treatment,
          medication: createMedicalRecordDto.medication,
          visitType: createMedicalRecordDto.visitType,
          bloodPressure: createMedicalRecordDto.bloodPressure,
          heartRate: createMedicalRecordDto.heartRate,
          temperature: createMedicalRecordDto.temperature,
          weight: createMedicalRecordDto.weight,
          height: createMedicalRecordDto.height,
          notes: createMedicalRecordDto.notes,
          patientId: createMedicalRecordDto.patientId,
        },
      });
  
      return newMedicalRecord;
  
    } catch (error) {
      console.error("Error creating medical record:", error);
  
      if (error instanceof ConflictException) {
        throw error;
      } else if (error instanceof BadRequestException) {
        throw error;
      }
  
      throw new InternalServerErrorException('Failed to create medical record.');
    }
  }
  
  async findAll(): Promise<MedicalRecord[]> {
    try {
      return await this.prisma.medicalRecord.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch medical records.');
    }
  }

  async findOne(id: number): Promise<MedicalRecord> {
    try {
      const record = await this.prisma.medicalRecord.findUnique({
        where: { id },
      });

      if (!record) {
        throw new NotFoundException('Medical record not found.');
      }

      return record;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch medical record.');
    }
  }

  async update(id: number, updateMedicalRecordDto: UpdateMedicalRecordDto): Promise<MedicalRecord> {
    try {
      const record = await this.prisma.medicalRecord.findUnique({
        where: { id },
      });

      if (!record) {
        throw new NotFoundException('Medical record not found.');
      }

      return await this.prisma.medicalRecord.update({
        where: { id },
        data: updateMedicalRecordDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update medical record.');
    }
  }

  async remove(id: number): Promise<MedicalRecord> {
    try {
      const record = await this.prisma.medicalRecord.findUnique({
        where: { id },
      });

      if (!record) {
        throw new NotFoundException(`Medical record with ID ${id} not found`);
      }

      return await this.prisma.medicalRecord.delete({
        where: {id},
      });

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete medical record with ID ${id}: ${error.message}`);
    }
  }

  async findByPatientId(patientId: number): Promise<MedicalRecord []> {
    try {
      const records = await this.prisma.medicalRecord.findMany({
        where: { patientId },
      });

      if (!records.length) {
        throw new NotFoundException('No medical records found for this patient');
      }

      return records;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async generatePDF(patientId: number, recordId: number): Promise<Buffer> {
    try {
      const patient = await this.prisma.patient.findUnique({
        where: { id: patientId },
      });

      if (!patient) {
        throw new NotFoundException('Patient not found.');
      }

      const record = await this.prisma.medicalRecord.findUnique({
        where: { id: recordId },
      });
      
      if (!record) {
        throw new NotFoundException('Medical record not found.');
      }

      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage([600, 800]);
      const { width, height } = page.getSize();
      const fontSize = 12;
      const titleFontSize = 16;
      
      page.drawText(`Medical Record for ${patient.firstName} ${patient.lastName}`, {
        x: 50,
        y: height - 4 * fontSize,
        size: titleFontSize,
        color: rgb(0.1411764705882353, 0.08235294117647059, 0.44313725490196076),
      });

      let yPosition = height - 100;

      page.drawText(`Date: ${record.date.toDateString()}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;

      page.drawText(`Diagnosis: ${record.diagnosis}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;

      page.drawText(`Treatment: ${record.treatment}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;

      page.drawText(`Medication: ${record.medication}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;

      page.drawText(`Visit Type: ${record.visitType}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;

      page.drawText(`Blood Pressure: ${record.bloodPressure}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;

      page.drawText(`Heart Rate: ${record.heartRate}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;

      page.drawText(`Temperature: ${record.temperature} °C`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;

      page.drawText(`Weight: ${record.weight} kg`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;

      page.drawText(`Height: ${record.height} cm`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;

      page.drawText(`Notes: ${record.notes}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= 30;

      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate PDF.');
    }
  }
  
  /************************************************************************************************ */

  private convertBigIntToNumber(results: any[]): any[] {
    return results.map(result => {
      const newResult: any = { ...result };
      for (const key in newResult) {
        if (typeof newResult[key] === 'bigint') {
          newResult[key] = Number(newResult[key]);
        }
      }
      if (newResult.month) {
        newResult.month = new Date(newResult.month).toISOString().slice(0, 7); 
      }
      return newResult;
    });
  }  

  async getMedicalRecordsCountByDiagnosisPerMonth(): Promise<{ month: string; diagnosis: string; count: number }[]> {
    try {
      const results = await this.prisma.$queryRaw<any[]>(Prisma.sql`
        SELECT
          TO_CHAR(DATE_TRUNC('month', "date"), 'YYYY-MM') AS month,
          "diagnosis",
          COUNT(*) AS count
        FROM "MedicalRecord"
        GROUP BY month, "diagnosis"
        ORDER BY month, "diagnosis";
      `);

      return results.map(result => ({
        ...result,
        count: Number(result.count),
      }));
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch medical records count by diagnosis per month.');
    }
  }

  /************************************************************************************** */

  async getMedicalRecordsCountByVisitTypePerMonth(): Promise<{ month: string; visitType: string; count: number }[]> {
    try {
      const results = await this.prisma.$queryRaw<any[]>(Prisma.sql`
        SELECT
          TO_CHAR(DATE_TRUNC('month', "date"), 'YYYY-MM') AS month,
          "visitType",
          COUNT(*) AS count
        FROM "MedicalRecord"
        GROUP BY month, "visitType"
        ORDER BY month, "visitType";
      `);
      return this.convertBigIntToNumber(results);
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch medical records count by visit type per month.');
    }
  }

   /************************************************************************************** */

}
