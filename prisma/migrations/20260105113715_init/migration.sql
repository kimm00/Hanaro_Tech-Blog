-- CreateTable
CREATE TABLE `Category` (
    `id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(31) NOT NULL,

    UNIQUE INDEX `Category_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `post_id` INTEGER UNSIGNED NOT NULL,
    `writer` INTEGER UNSIGNED NOT NULL,
    `parent_id` INTEGER UNSIGNED NULL,
    `content` TEXT NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `Comment_post_id_idx`(`post_id`),
    INDEX `Comment_writer_idx`(`writer`),
    INDEX `Comment_parent_id_idx`(`parent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `category` TINYINT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `writer` INTEGER UNSIGNED NOT NULL,
    `contents` TEXT NULL,
    `readcnt` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    INDEX `fk_Post_category`(`category`),
    INDEX `fk_Post_writer`(`writer`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostLike` (
    `post_id` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_PostLike_user`(`user_id`),
    PRIMARY KEY (`post_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StopWord` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(31) NOT NULL,

    UNIQUE INDEX `uniq_StopWord_value`(`value`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(31) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NULL,
    `passwd` VARCHAR(256) NULL,
    `isadmin` BOOLEAN NOT NULL DEFAULT false,
    `outdt` DATETIME(0) NULL,

    UNIQUE INDEX `uniq_User_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_writer_fkey` FOREIGN KEY (`writer`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `Comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_ibfk_1` FOREIGN KEY (`category`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_ibfk_2` FOREIGN KEY (`writer`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `PostLike` ADD CONSTRAINT `PostLike_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `PostLike` ADD CONSTRAINT `PostLike_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
