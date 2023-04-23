/*
  Warnings:

  - You are about to drop the column `roomId` on the `image` table. All the data in the column will be lost.
  - Added the required column `apartmentId` to the `image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "image" DROP CONSTRAINT "image_roomId_fkey";

-- AlterTable
ALTER TABLE "image" DROP COLUMN "roomId",
ADD COLUMN     "apartmentId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
