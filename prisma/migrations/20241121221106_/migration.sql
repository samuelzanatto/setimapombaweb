-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_event_participants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" DATETIME,
    CONSTRAINT "event_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_event_participants" ("eventId", "id", "joinedAt", "leftAt", "userId") SELECT "eventId", "id", "joinedAt", "leftAt", "userId" FROM "event_participants";
DROP TABLE "event_participants";
ALTER TABLE "new_event_participants" RENAME TO "event_participants";
CREATE UNIQUE INDEX "event_participants_userId_eventId_key" ON "event_participants"("userId", "eventId");
CREATE TABLE "new_events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "youtubeId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "privacy" TEXT NOT NULL DEFAULT 'public',
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "participants" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isOfferingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_events" ("createdAt", "description", "endTime", "id", "isActive", "isLive", "isOfferingEnabled", "privacy", "startTime", "status", "title", "updatedAt", "viewCount", "youtubeId") SELECT "createdAt", "description", "endTime", "id", "isActive", "isLive", "isOfferingEnabled", "privacy", "startTime", coalesce("status", 'scheduled') AS "status", "title", "updatedAt", coalesce("viewCount", 0) AS "viewCount", "youtubeId" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
CREATE TABLE "new_readings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "minute" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "readings_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_readings" ("createdAt", "eventId", "id", "minute", "text") SELECT "createdAt", "eventId", "id", "minute", "text" FROM "readings";
DROP TABLE "readings";
ALTER TABLE "new_readings" RENAME TO "readings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
