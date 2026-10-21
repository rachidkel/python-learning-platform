/*
  Warnings:

  - You are about to drop the column `solution` on the `Mission` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "starterCode" TEXT NOT NULL,
    "tests" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 50,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Mission" ("createdAt", "description", "difficulty", "id", "order", "slug", "starterCode", "tests", "title", "xpReward") SELECT "createdAt", "description", "difficulty", "id", "order", "slug", "starterCode", "tests", "title", "xpReward" FROM "Mission";
DROP TABLE "Mission";
ALTER TABLE "new_Mission" RENAME TO "Mission";
CREATE UNIQUE INDEX "Mission_slug_key" ON "Mission"("slug");
CREATE TABLE "new_RevisionItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "easeFactor" REAL NOT NULL DEFAULT 2.5,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "lastReviewed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextReviewAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RevisionItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RevisionItem_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RevisionItem" ("createdAt", "easeFactor", "id", "interval", "lastReviewed", "nextReviewAt", "questionId", "repetitions", "userId") SELECT "createdAt", "easeFactor", "id", "interval", "lastReviewed", "nextReviewAt", "questionId", "repetitions", "userId" FROM "RevisionItem";
DROP TABLE "RevisionItem";
ALTER TABLE "new_RevisionItem" RENAME TO "RevisionItem";
CREATE UNIQUE INDEX "RevisionItem_userId_questionId_key" ON "RevisionItem"("userId", "questionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
