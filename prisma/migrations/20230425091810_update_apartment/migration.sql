/*
  Warnings:

  - Added the required column `address` to the `Apartment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtitle` to the `Apartment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "subtitle" TEXT NOT NULL;
