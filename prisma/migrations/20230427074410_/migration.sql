/*
  Warnings:

  - Made the column `price` on table `Room` required. This step will fail if there are existing NULL values in that column.
  - Made the column `area` on table `Room` required. This step will fail if there are existing NULL values in that column.
  - Made the column `living_room` on table `Room` required. This step will fail if there are existing NULL values in that column.
  - Made the column `apartmentId` on table `Room` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_apartmentId_fkey";

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "area" SET NOT NULL,
ALTER COLUMN "living_room" SET NOT NULL,
ALTER COLUMN "living_room" SET DEFAULT 1,
ALTER COLUMN "floor" DROP NOT NULL,
ALTER COLUMN "apartmentId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
