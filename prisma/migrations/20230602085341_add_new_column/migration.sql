-- CreateEnum
CREATE TYPE "role" AS ENUM ('user', 'lessor', 'admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "role" NOT NULL DEFAULT 'user',
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
