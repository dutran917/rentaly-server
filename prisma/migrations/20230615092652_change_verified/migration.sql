/*
  Warnings:

  - You are about to drop the column `verified` on the `RoomRenter` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.
  - The `verified` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "RoomRenter" DROP COLUMN "verified";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "status",
DROP COLUMN "verified",
ADD COLUMN     "verified" "VERIFY_STATUS" NOT NULL DEFAULT 'PENDING';
