-- CreateTable
CREATE TABLE "Apointment" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "roomId" INTEGER NOT NULL,
    "apartmentId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Apointment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Apointment" ADD CONSTRAINT "Apointment_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apointment" ADD CONSTRAINT "Apointment_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apointment" ADD CONSTRAINT "Apointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
