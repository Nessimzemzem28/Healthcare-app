import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.service';
import { Appointment, Prisma } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentService {

  constructor(private prisma: PrismaService) {}

  // Function to retrieve all appointments
  async findAll(): Promise<Appointment []> {
    return this.prisma.appointment.findMany();
  }

  // Function to retrieve a single appointment by ID
  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.prisma.appointment.findUnique({
      where:{id},
      include: {
        patient: true,
      },
    });

    if(!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  // Function to create a new appointment
  async create(data: CreateAppointmentDto): Promise<Appointment> {
    this.validateTimeRange(data.startTime);

    try {
      const existingAppointment = await this.prisma.appointment.findFirst({
        where: {
          date: new Date(data.date),
          startTime: new Date(data.startTime), 
        },
      });

      if (existingAppointment) {
        throw new Error(`An appointment already exists on ${data.date} at ${data.startTime}`);
      }

      return await this.prisma.appointment.create({
        data: {
          date: new Date(data.date),
          startTime: new Date(data.startTime), 
          doctor: data.doctor,
          reason: data.reason,
          patient: { connect: { id: data.patientId } },
        },
      });

    } catch (error) {
      throw new Error(`Failed to create appointment: ${error.message}`);
    }
  }


  // Function to update an existing appointment
  async update(id: number, data: UpdateAppointmentDto): Promise<Appointment> {
    this.validateTimeRange(data.startTime);

    try {
      const existingAppointment = await this.prisma.appointment.findUnique({
        where:{id},
      });

      if(!existingAppointment) {
        throw new NotFoundException(`Appointment with ID ${id} not found`);
      }

      const { date, startTime, doctor, reason, patientId } = data;

      return await this.prisma.appointment.update({
        where:{id},
        data: {
          date: date ? new Date(date) : undefined,
          startTime: startTime ? new Date(startTime) : undefined,
          doctor,
          reason,
          patient: patientId ? {connect: {id: patientId}} : undefined,

        },
      });

    } catch (error) {
      throw new Error(`Failed to update appointment with ID ${id}: ${error.message}`);
    }
  }

  // Function to delete an appointment
  async remove(id: number): Promise<Appointment> {
    try {
      const appointment = await this.prisma.appointment.delete({
        where: { id },
      });

      if (!appointment) {
        throw new NotFoundException(`Appointment with ID ${id} not found`);
      }

      return appointment;
    } catch (error) {
      throw new Error(`Failed to delete appointment with ID ${id}: ${error.message}`);
    }
  }

   // Function to fetch appointments for a specific day and sort by startTime
   async getAppointmentsForDay(day: Date): Promise<Appointment[]> {
    try {
      const appointments = await this.prisma.appointment.findMany({
        where: {
          date: {
            gte: day,
            lt: new Date(day.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        orderBy: {
          startTime: 'asc', 
        },
      });

      return appointments;
    } catch (error) {
      throw new Error(`Failed to fetch appointments for day ${day.toISOString()}: ${error.message}`);
    }
  }
  
   // Function to fetch the nearest upcoming appointment for a patient
   async getNearestAppointmentForPatient(patientId: number): Promise<Appointment | null> {
    try {
      const now = new Date();
      const nearestAppointment = await this.prisma.appointment.findFirst({
        where: {
          patientId,
          date: {
            gte: now,
          },
        },
        orderBy: {
          date: 'asc',
        },
      });

      return nearestAppointment;
    } catch (error) {
      throw new Error(`Failed to fetch nearest appointment for patient ${patientId}: ${error.message}`);
    }
  }

  // Function to fetch appointments with patient details
  async getAppointmentsWithDetails(): Promise<any[]> {
    try {
      const appointments = await this.prisma.appointment.findMany({
        include: {
          patient: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: [
          { date: 'asc' },
          { startTime: 'asc' }
        ]
      });

      return appointments;
    } catch (error) {
      throw new Error(`Failed to fetch appointments with details: ${error.message}`);
    }
  }

  // Function to reschedule an appointment
  async reschedule(id: number, newDate: Date, newStartTime: Date): Promise<Appointment> {
      this.validateTimeRange(newStartTime);
      
      const now = new Date();

      const existingAppointment = await this.prisma.appointment.findUnique({
        where: { id },
      });

      if (!existingAppointment) {
        throw new NotFoundException(`Appointment with ID ${id} not found`);
      }

      if (new Date(existingAppointment.date) < now || new Date(existingAppointment.startTime) < now) {
        throw new BadRequestException('Cannot reschedule an appointment that has already passed.');
      }

      // Check if the new date and time are in the future
      if (newDate < now || newStartTime < now) {
        throw new BadRequestException('The new date and time must be in the future.');
      }

      // Check for conflicts with existing appointments
      const conflictingAppointment = await this.prisma.appointment.findFirst({
        where: {
          date: newDate,
          startTime: newStartTime,
          NOT: {
            id: id, 
          },
        },
      });

      if (conflictingAppointment) {
        throw new BadRequestException('There is already an appointment scheduled at this time.');
      }

      // Update the appointment with new date and start time
      return await this.prisma.appointment.update({
        where: { id },
        data: {
          date: newDate,
          startTime: newStartTime,
        },
      });
  }

  // Helper function to validate the startTime
  private validateTimeRange(time: Date | string): void {
    if (typeof time === 'string') {
      time = new Date(`1970-01-01T${time}`);
    }

    const hours = time.getHours();
    const minutes = time.getMinutes();

    if ((hours < 8 || hours > 20) || (hours === 20 && minutes > 0)) {
      throw new BadRequestException('Start time must be between 08:00 and 20:00');
    }
  }
}

