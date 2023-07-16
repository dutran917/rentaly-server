-- AlterTable
ALTER TABLE "Apartment" ALTER COLUMN "published" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "display" BOOLEAN NOT NULL DEFAULT true;
