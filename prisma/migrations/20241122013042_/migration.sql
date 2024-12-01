-- CreateTable
CREATE TABLE "lives" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "youtubeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "viewers" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "ofertaAtiva" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "leituras" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "texto" TEXT NOT NULL,
    "minuto" TEXT NOT NULL,
    "liveId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "leituras_liveId_fkey" FOREIGN KEY ("liveId") REFERENCES "lives" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "mensagens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "liveId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "mensagens_liveId_fkey" FOREIGN KEY ("liveId") REFERENCES "lives" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pedidos_oracao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "para" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "liveId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pedidos_oracao_liveId_fkey" FOREIGN KEY ("liveId") REFERENCES "lives" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "viewer_sessions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" TEXT NOT NULL,
    "liveId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    CONSTRAINT "viewer_sessions_liveId_fkey" FOREIGN KEY ("liveId") REFERENCES "lives" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "lives_youtubeId_key" ON "lives"("youtubeId");

-- CreateIndex
CREATE UNIQUE INDEX "viewer_sessions_sessionId_key" ON "viewer_sessions"("sessionId");
