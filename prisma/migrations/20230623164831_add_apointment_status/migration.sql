-- CreateEnum
CREATE TYPE "APOINT_STATUS" AS ENUM ('PENDING', 'SUCCESS', 'CANCEL');

-- AlterTable
ALTER TABLE "Apointment" ADD COLUMN     "status" "APOINT_STATUS" NOT NULL DEFAULT 'PENDING';
