-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "youtubeId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "privacy" TEXT NOT NULL DEFAULT 'public',
    "status" TEXT,
    "viewCount" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isOfferingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_events" ("createdAt", "description", "endTime", "id", "isActive", "isOfferingEnabled", "startTime", "title", "updatedAt", "youtubeId") SELECT "createdAt", "description", "endTime", "id", "isActive", "isOfferingEnabled", "startTime", "title", "updatedAt", "youtubeId" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
