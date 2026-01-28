/*
  Warnings:

  - You are about to drop the column `bio` on the `internprofile` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `internprofile` table. All the data in the column will be lost.
  - You are about to drop the column `github` on the `internprofile` table. All the data in the column will be lost.
  - You are about to drop the column `linkedin` on the `internprofile` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `internprofile` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `internprofile` table. All the data in the column will be lost.
  - You are about to drop the column `portfolio` on the `internprofile` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `internprofile` table. All the data in the column will be lost.
  - You are about to drop the column `resume` on the `internprofile` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `internprofile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `internprofile` DROP COLUMN `bio`,
    DROP COLUMN `experience`,
    DROP COLUMN `github`,
    DROP COLUMN `linkedin`,
    DROP COLUMN `location`,
    DROP COLUMN `phone`,
    DROP COLUMN `portfolio`,
    DROP COLUMN `profilePicture`,
    DROP COLUMN `resume`,
    DROP COLUMN `skills`;
