/*
  Warnings:

  - You are about to drop the column `aboutInternship` on the `internship` table. All the data in the column will be lost.
  - You are about to drop the column `certificate` on the `internship` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `internship` table. All the data in the column will be lost.
  - You are about to drop the column `educationLevel` on the `internship` table. All the data in the column will be lost.
  - You are about to drop the column `experienceRequired` on the `internship` table. All the data in the column will be lost.
  - You are about to drop the column `hoursPerDay` on the `internship` table. All the data in the column will be lost.
  - You are about to drop the column `jobOffer` on the `internship` table. All the data in the column will be lost.
  - You are about to drop the column `locationType` on the `internship` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfOpenings` on the `internship` table. All the data in the column will be lost.
  - You are about to drop the column `otherBenefits` on the `internship` table. All the data in the column will be lost.
  - You are about to drop the column `requiredSkills` on the `internship` table. All the data in the column will be lost.
  - You are about to drop the column `rolesResponsibilities` on the `internship` table. All the data in the column will be lost.
  - You are about to drop the column `selectionProcess` on the `internship` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `internship` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `internship` table. All the data in the column will be lost.
  - You are about to drop the column `whatInternWillLearn` on the `internship` table. All the data in the column will be lost.
  - You are about to drop the column `workingHours` on the `internship` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `internship` DROP COLUMN `aboutInternship`,
    DROP COLUMN `certificate`,
    DROP COLUMN `companyName`,
    DROP COLUMN `educationLevel`,
    DROP COLUMN `experienceRequired`,
    DROP COLUMN `hoursPerDay`,
    DROP COLUMN `jobOffer`,
    DROP COLUMN `locationType`,
    DROP COLUMN `numberOfOpenings`,
    DROP COLUMN `otherBenefits`,
    DROP COLUMN `requiredSkills`,
    DROP COLUMN `rolesResponsibilities`,
    DROP COLUMN `selectionProcess`,
    DROP COLUMN `startDate`,
    DROP COLUMN `type`,
    DROP COLUMN `whatInternWillLearn`,
    DROP COLUMN `workingHours`,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `providerprofile` ADD COLUMN `companySize` VARCHAR(191) NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `foundedYear` INTEGER NULL,
    ADD COLUMN `location` VARCHAR(191) NULL,
    ADD COLUMN `logo` VARCHAR(191) NULL,
    ADD COLUMN `mission` VARCHAR(191) NULL,
    ADD COLUMN `socialLinks` JSON NULL,
    ADD COLUMN `vision` VARCHAR(191) NULL,
    MODIFY `website` VARCHAR(191) NULL;
