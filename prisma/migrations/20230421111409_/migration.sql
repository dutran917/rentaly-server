/*
  Warnings:

  - You are about to drop the column `postId` on the `image` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roomId` to the `image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "image" DROP CONSTRAINT "image_postId_fkey";

-- AlterTable
ALTER TABLE "image" DROP COLUMN "postId",
ADD COLUMN     "roomId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "price" INTEGER,
    "area" DOUBLE PRECISION,
    "authorId" INTEGER NOT NULL,
    "living_room" INTEGER,
    "bed_room" INTEGER,
    "floor" INTEGER NOT NULL,
    "apartmentId" INTEGER,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apartment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN DEFAULT false,
    "ownerId" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "long" DOUBLE PRECISION NOT NULL,
    "district" TEXT NOT NULL,
    "province" TEXT NOT NULL,

    CONSTRAINT "Apartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsInApartment" (
    "apartmentId" INTEGER NOT NULL,
    "apartmentTagId" INTEGER NOT NULL,

    CONSTRAINT "TagsInApartment_pkey" PRIMARY KEY ("apartmentId","apartmentTagId")
);

-- CreateTable
CREATE TABLE "TagsInRoom" (
    "roomId" INTEGER NOT NULL,
    "roomTagId" INTEGER NOT NULL,

    CONSTRAINT "TagsInRoom_pkey" PRIMARY KEY ("roomId","roomTagId")
);

-- CreateTable
CREATE TABLE "ApartmentTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApartmentTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApartmentTag_name_key" ON "ApartmentTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RoomTag_name_key" ON "RoomTag"("name");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apartment" ADD CONSTRAINT "Apartment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsInApartment" ADD CONSTRAINT "TagsInApartment_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsInApartment" ADD CONSTRAINT "TagsInApartment_apartmentTagId_fkey" FOREIGN KEY ("apartmentTagId") REFERENCES "ApartmentTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsInRoom" ADD CONSTRAINT "TagsInRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsInRoom" ADD CONSTRAINT "TagsInRoom_roomTagId_fkey" FOREIGN KEY ("roomTagId") REFERENCES "RoomTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
