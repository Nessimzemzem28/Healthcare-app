import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.service';
import { Patient, Prisma } from '@prisma/client';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class PatientService {

  constructor(private prisma: PrismaService) {}


  async findAll(): Promise<Patient[]> {
    return this.prisma.patient.findMany();
  }



  async findOne(id: number): Promise<Patient | null> {
    const patient = await this.prisma.patient.findUnique({
      where:{id},
      include: {
        appointments: true,
        medicalRecords: true,
      },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return patient;
  }



  async create(data: CreatePatientDto): Promise<Patient> {
    try {
      // Format birthDate to YYYY-MM-DD
      const formattedBirthDate = dayjs(data.birthDate).format('YYYY-MM-DD');
  
      // Ensure birthDate is in ISO-8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
      const isoFormattedBirthDate = dayjs(formattedBirthDate).toISOString();
  
      // Check if a patient with the same first name, last name, and birthdate already exists
      const existingPatient = await this.prisma.patient.findFirst({
        where: {
          firstName: data.firstName,
          lastName: data.lastName,
          birthDate: isoFormattedBirthDate,
        },
      });
  
      if (existingPatient) {
        throw new Error('A patient with the same first name, last name, and birthdate already exists');
      }
  
      return await this.prisma.patient.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          birthDate: isoFormattedBirthDate,
          address: data.address,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create patient: ${error.message}`);
    }
  }
  


  async update(id: number, data: UpdatePatientDto): Promise<Patient> {
    try {
      const existingPatient = await this.prisma.patient.findUnique({
        where: {id},
      });

      if(!existingPatient) {
        throw new NotFoundException(`Patient with ID ${id} not found`);
      }

      return await this.prisma.patient.update({
        where:{id},
        data: {
          firstName: data.firstName ?? existingPatient.firstName,
          lastName: data.lastName ?? existingPatient.lastName,
          birthDate: data.birthDate ?? existingPatient.birthDate,
          address: data.address ?? existingPatient.address,
        },
      });

    } catch (error) {
      throw new Error(`Failed to update patient with ID ${id}: ${error.message}`);
    }
  }

  async remove(id: number): Promise<Patient> {
    try {
      const patient= await this.prisma.patient.delete({
        where:{id},
      });

      if(!patient) {
        throw new Error(`Patient with ID ${id} not found`);
      }

      return patient;

    } catch (error) {
      throw new Error(`Failed to delete patient with ID ${id}: ${error.message}`);
    }
  }

  async searchByFullName(fullName: string): Promise<Patient[]> {
    try {
      return await this.prisma.patient.findMany({
        where: {
          AND: [
            { firstName: { startsWith: fullName.split(' ')[0], mode: 'insensitive' } },
            { lastName: { endsWith: fullName.split(' ')[1], mode: 'insensitive' } }
          ]
        }
      });
    } catch (error) {
      throw new Error(`Failed to search patients by full name: ${error.message}`);
    }
  }
  
  async searchByFirstName(firstName: string): Promise<Patient[]> {
    try {
      return await this.prisma.patient.findMany({
        where: {
          firstName: {
            startsWith: firstName,
            mode: 'insensitive',
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to search patients by first name: ${error.message}`);
    }
  }
  
  async searchByLastName(lastName: string): Promise<Patient[]> {
    try {
      return await this.prisma.patient.findMany({
        where: {
          lastName: {
            startsWith: lastName,
            mode: 'insensitive',
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to search patients by last name: ${error.message}`);
    }
  }
  
}
