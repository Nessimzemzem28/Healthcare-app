/*
  Warnings:

  - Added the required column `diagnosis` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `treatment` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visitType` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Diagnosis" AS ENUM ('Hypertension', 'Diabetes', 'Asthma', 'Flu', 'Covid19', 'HeartDisease', 'Other');

-- CreateEnum
CREATE TYPE "Treatment" AS ENUM ('Medication', 'Surgery', 'Therapy', 'LifestyleChange', 'FollowUp', 'Other');

-- CreateEnum
CREATE TYPE "Medication" AS ENUM ('Antibiotics', 'Painkillers', 'Insulin', 'Inhalers', 'Antihypertensives', 'Other');

-- CreateEnum
CREATE TYPE "VisitType" AS ENUM ('RoutineCheckUp', 'Consultation', 'BloodTest', 'Vaccination');

-- AlterTable
ALTER TABLE "MedicalRecord" ADD COLUMN     "bloodPressure" TEXT,
ADD COLUMN     "diagnosis" "Diagnosis" NOT NULL,
ADD COLUMN     "heartRate" INTEGER,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "medication" "Medication",
ADD COLUMN     "temperature" DOUBLE PRECISION,
ADD COLUMN     "treatment" "Treatment" NOT NULL,
ADD COLUMN     "visitType" "VisitType" NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION;
