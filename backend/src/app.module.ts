import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { PatientModule } from './patient/patient.module';
import { AppointmentModule } from './appointment/appointment.module';
import { MedicalRecordModule } from './medical-record/medical-record.module';

@Module({
  imports: [ConfigModule.forRoot(), CoreModule, PatientModule, AppointmentModule, MedicalRecordModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
