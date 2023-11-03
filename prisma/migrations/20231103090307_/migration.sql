-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MODERATOR', 'USER');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('COMPUTER_SCIENCE_1', 'COMPUTER_SCIENCE_2', 'COMPUTER_SCIENCE_3', 'ARTIFICIAL_INTELLIGENCE', 'COMPUTER_SCIENCE_AND_NETWORKS', 'INTELLIGENT_SYSTEMS', 'PHYSICS_INFORMATION', 'BIOINFORMATICS');

-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('B1_SPRING', 'B1_AUTUMN', 'B2_SPRING', 'B2_AUTUMN', 'B3_SPRING', 'B3_AUTUMN', 'B4', 'MASTER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "entranceYear" INTEGER NOT NULL,
    "department" "Department" NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "validCount" INTEGER NOT NULL,
    "ExpiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" "Department" NOT NULL,
    "semester" "Semester" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "url" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("url")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
