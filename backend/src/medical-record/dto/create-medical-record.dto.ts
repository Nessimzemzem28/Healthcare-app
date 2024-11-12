import { IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "@nestjs/class-validator";
import { Diagnosis, Medication, Treatment, VisitType } from "@prisma/client";


export class CreateMedicalRecordDto {
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsEnum(Diagnosis)
  @IsNotEmpty()
  diagnosis: Diagnosis;

  @IsEnum(Treatment)
  @IsNotEmpty()
  treatment: Treatment;

  @IsEnum(Medication)
  @IsOptional()
  medication?: Medication;

  @IsEnum(VisitType)
  @IsNotEmpty()
  visitType: VisitType;

  @IsString()
  @IsOptional()
  bloodPressure?: string;

  @IsInt()
  @IsOptional()
  heartRate?: number;

  @IsNumber()
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsString()
  @IsNotEmpty()
  notes: string;

  @IsInt()
  @IsNotEmpty()
  patientId: number;
}
