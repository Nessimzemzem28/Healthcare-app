/*
  Warnings:

  - Added the required column `startTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "reason" TEXT,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;
