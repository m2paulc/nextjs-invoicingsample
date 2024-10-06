/*
  Warnings:

  - Added the required column `updatedAt` to the `Parts` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Parts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Parts_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("invoiceId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Parts" ("description", "id", "invoiceId", "priceInCents", "quantity") SELECT "description", "id", "invoiceId", "priceInCents", "quantity" FROM "Parts";
DROP TABLE "Parts";
ALTER TABLE "new_Parts" RENAME TO "Parts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
