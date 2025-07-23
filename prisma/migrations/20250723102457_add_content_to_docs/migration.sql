/*
  Warnings:

  - You are about to drop the column `ctx` on the `docs` table. All the data in the column will be lost.
  - Added the required column `content` to the `Docs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `docs` DROP COLUMN `ctx`,
    ADD COLUMN `content` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `auth` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `ctx` VARCHAR(191) NULL,

    UNIQUE INDEX `auth_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
