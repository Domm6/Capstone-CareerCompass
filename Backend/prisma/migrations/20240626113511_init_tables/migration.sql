/*
  Warnings:

  - You are about to drop the column `user_role` on the `User` table. All the data in the column will be lost.
  - Added the required column `userRole` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "user_role",
ADD COLUMN     "userRole" "UserRole" NOT NULL;
