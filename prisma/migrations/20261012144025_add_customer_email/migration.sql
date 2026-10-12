-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customerEmail" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
