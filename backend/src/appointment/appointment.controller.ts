import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  async findAll(): Promise<Appointment[]> {
    return this.appointmentService.findAll();
  }

  @Get('details')
  async getAppointmentsWithDetails(): Promise<any[]> {
    try {
      return await this.appointmentService.getAppointmentsWithDetails();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Appointment> {
    const appointment = await this.appointmentService.findOne(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    try {
      return await this.appointmentService.create(createAppointmentDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    try {
      return await this.appointmentService.update(id, updateAppointmentDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Appointment> {
    try {
      return await this.appointmentService.remove(+id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('day/:day')
  async getAppointmentsForDay(@Param('day') day: string): Promise<Appointment[]> {
    try {
      const appointments = await this.appointmentService.getAppointmentsForDay(new Date(day));
      return appointments;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('nearest/:patientId')
  async getNearestAppointmentForPatient(@Param('patientId', ParseIntPipe) patientId: number): Promise<Appointment | null> {
    try {
      return await this.appointmentService.getNearestAppointmentForPatient(patientId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id/reschedule')
  async rescheduleAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { newDate: string; newStartTime: string }
  ) {
    const newDate = new Date(body.newDate);
    const newStartTime = new Date(body.newStartTime);
    return this.appointmentService.reschedule(id, newDate, newStartTime);
  }

}
