/*
  Warnings:

  - You are about to drop the column `userId` on the `Apointment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Apointment" DROP CONSTRAINT "Apointment_userId_fkey";

-- AlterTable
ALTER TABLE "Apointment" DROP COLUMN "userId";
