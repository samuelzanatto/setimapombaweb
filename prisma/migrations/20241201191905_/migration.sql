-- CreateTable
CREATE TABLE "cargos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "locais" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "cultos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "dataInicio" DATETIME NOT NULL,
    "dataTermino" DATETIME NOT NULL,
    "localId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "pastorId" INTEGER NOT NULL,
    "obreiroId" INTEGER NOT NULL,
    "liderCanticoId" INTEGER NOT NULL,
    "videoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cultos_localId_fkey" FOREIGN KEY ("localId") REFERENCES "locais" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cultos_pastorId_fkey" FOREIGN KEY ("pastorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cultos_obreiroId_fkey" FOREIGN KEY ("obreiroId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cultos_liderCanticoId_fkey" FOREIGN KEY ("liderCanticoId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reunioes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "dataHora" DATETIME NOT NULL,
    "localId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "responsavelId" INTEGER NOT NULL,
    "materiais" TEXT NOT NULL,
    "cronograma" TEXT NOT NULL,
    "informacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "reunioes_localId_fkey" FOREIGN KEY ("localId") REFERENCES "locais" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reunioes_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ensaios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "dataHora" DATETIME NOT NULL,
    "localId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "responsavelId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ensaios_localId_fkey" FOREIGN KEY ("localId") REFERENCES "locais" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ensaios_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "dataHora" DATETIME NOT NULL,
    "localId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "cronograma" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "eventos_localId_fkey" FOREIGN KEY ("localId") REFERENCES "locais" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "mensagens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "traduzidoPor" TEXT,
    "conteudo" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "hinos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "letra" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "leituras_biblicas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "livro" TEXT NOT NULL,
    "capitulo" INTEGER NOT NULL,
    "versiculos" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_auxiliares" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_auxiliares_A_fkey" FOREIGN KEY ("A") REFERENCES "cultos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_auxiliares_B_fkey" FOREIGN KEY ("B") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_vocal" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_vocal_A_fkey" FOREIGN KEY ("A") REFERENCES "cultos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_vocal_B_fkey" FOREIGN KEY ("B") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CultoToHino" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CultoToHino_A_fkey" FOREIGN KEY ("A") REFERENCES "cultos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CultoToHino_B_fkey" FOREIGN KEY ("B") REFERENCES "hinos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CultoToMensagem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CultoToMensagem_A_fkey" FOREIGN KEY ("A") REFERENCES "cultos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CultoToMensagem_B_fkey" FOREIGN KEY ("B") REFERENCES "mensagens" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CultoToLeituraBiblica" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CultoToLeituraBiblica_A_fkey" FOREIGN KEY ("A") REFERENCES "cultos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CultoToLeituraBiblica_B_fkey" FOREIGN KEY ("B") REFERENCES "leituras_biblicas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_participantes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_participantes_A_fkey" FOREIGN KEY ("A") REFERENCES "ensaios" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_participantes_B_fkey" FOREIGN KEY ("B") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EnsaioToHino" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EnsaioToHino_A_fkey" FOREIGN KEY ("A") REFERENCES "ensaios" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EnsaioToHino_B_fkey" FOREIGN KEY ("B") REFERENCES "hinos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "cargoId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "users_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "cargos" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_users" ("createdAt", "email", "id", "name", "password", "updatedAt", "username") SELECT "createdAt", "email", "id", "name", "password", "updatedAt", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_username_idx" ON "users"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "cargos_nome_key" ON "cargos"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "_auxiliares_AB_unique" ON "_auxiliares"("A", "B");

-- CreateIndex
CREATE INDEX "_auxiliares_B_index" ON "_auxiliares"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_vocal_AB_unique" ON "_vocal"("A", "B");

-- CreateIndex
CREATE INDEX "_vocal_B_index" ON "_vocal"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CultoToHino_AB_unique" ON "_CultoToHino"("A", "B");

-- CreateIndex
CREATE INDEX "_CultoToHino_B_index" ON "_CultoToHino"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CultoToMensagem_AB_unique" ON "_CultoToMensagem"("A", "B");

-- CreateIndex
CREATE INDEX "_CultoToMensagem_B_index" ON "_CultoToMensagem"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CultoToLeituraBiblica_AB_unique" ON "_CultoToLeituraBiblica"("A", "B");

-- CreateIndex
CREATE INDEX "_CultoToLeituraBiblica_B_index" ON "_CultoToLeituraBiblica"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_participantes_AB_unique" ON "_participantes"("A", "B");

-- CreateIndex
CREATE INDEX "_participantes_B_index" ON "_participantes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EnsaioToHino_AB_unique" ON "_EnsaioToHino"("A", "B");

-- CreateIndex
CREATE INDEX "_EnsaioToHino_B_index" ON "_EnsaioToHino"("B");
