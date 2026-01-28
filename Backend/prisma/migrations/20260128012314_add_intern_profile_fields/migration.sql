/*
  Warnings:

  - You are about to drop the column `companySize` on the `providerprofile` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `providerprofile` table. All the data in the column will be lost.
  - You are about to drop the column `foundedYear` on the `providerprofile` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `providerprofile` table. All the data in the column will be lost.
  - You are about to drop the column `mission` on the `providerprofile` table. All the data in the column will be lost.
  - You are about to drop the column `socialLinks` on the `providerprofile` table. All the data in the column will be lost.
  - You are about to drop the column `vision` on the `providerprofile` table. All the data in the column will be lost.
  - Made the column `website` on table `providerprofile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `internprofile` ADD COLUMN `bio` VARCHAR(191) NULL,
    ADD COLUMN `experience` VARCHAR(191) NULL,
    ADD COLUMN `github` VARCHAR(191) NULL,
    ADD COLUMN `linkedin` VARCHAR(191) NULL,
    ADD COLUMN `location` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `portfolio` VARCHAR(191) NULL,
    ADD COLUMN `profilePicture` VARCHAR(191) NULL,
    ADD COLUMN `resume` VARCHAR(191) NULL,
    ADD COLUMN `skills` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `providerprofile` DROP COLUMN `companySize`,
    DROP COLUMN `description`,
    DROP COLUMN `foundedYear`,
    DROP COLUMN `location`,
    DROP COLUMN `mission`,
    DROP COLUMN `socialLinks`,
    DROP COLUMN `vision`,
    MODIFY `website` VARCHAR(191) NOT NULL;
