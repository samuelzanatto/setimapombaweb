-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "cargoId" INTEGER,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lives" (
    "id" SERIAL NOT NULL,
    "youtubeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "viewers" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "ofertaAtiva" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leituras" (
    "id" SERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "minuto" TEXT NOT NULL,
    "liveId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leituras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos_oracao" (
    "id" SERIAL NOT NULL,
    "para" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "liveId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedidos_oracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "viewer_sessions" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userName" TEXT,
    "userImage" TEXT,
    "liveId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "viewer_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "cargos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locais" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "locais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cultos" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataTermino" TIMESTAMP(3) NOT NULL,
    "localId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "pastorId" INTEGER NOT NULL,
    "obreiroId" INTEGER NOT NULL,
    "liderCanticoId" INTEGER NOT NULL,
    "videoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cultos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reunioes" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "localId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "responsavelId" INTEGER NOT NULL,
    "materiais" TEXT NOT NULL,
    "cronograma" TEXT NOT NULL,
    "informacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reunioes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ensaios" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "localId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "responsavelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ensaios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "localId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "cronograma" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensagens" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "traduzidoPor" TEXT,
    "conteudo" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mensagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hinos" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "letra" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hinos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leituras_biblicas" (
    "id" SERIAL NOT NULL,
    "livro" TEXT NOT NULL,
    "capitulo" INTEGER NOT NULL,
    "versiculos" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leituras_biblicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_auxiliares" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_vocal" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CultoToHino" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CultoToMensagem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CultoToLeituraBiblica" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_participantes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EnsaioToHino" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "lives_youtubeId_key" ON "lives"("youtubeId");

-- CreateIndex
CREATE UNIQUE INDEX "viewer_sessions_sessionId_key" ON "viewer_sessions"("sessionId");

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

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "cargos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leituras" ADD CONSTRAINT "leituras_liveId_fkey" FOREIGN KEY ("liveId") REFERENCES "lives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_oracao" ADD CONSTRAINT "pedidos_oracao_liveId_fkey" FOREIGN KEY ("liveId") REFERENCES "lives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viewer_sessions" ADD CONSTRAINT "viewer_sessions_liveId_fkey" FOREIGN KEY ("liveId") REFERENCES "lives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cultos" ADD CONSTRAINT "cultos_localId_fkey" FOREIGN KEY ("localId") REFERENCES "locais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cultos" ADD CONSTRAINT "cultos_pastorId_fkey" FOREIGN KEY ("pastorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cultos" ADD CONSTRAINT "cultos_obreiroId_fkey" FOREIGN KEY ("obreiroId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cultos" ADD CONSTRAINT "cultos_liderCanticoId_fkey" FOREIGN KEY ("liderCanticoId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reunioes" ADD CONSTRAINT "reunioes_localId_fkey" FOREIGN KEY ("localId") REFERENCES "locais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reunioes" ADD CONSTRAINT "reunioes_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ensaios" ADD CONSTRAINT "ensaios_localId_fkey" FOREIGN KEY ("localId") REFERENCES "locais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ensaios" ADD CONSTRAINT "ensaios_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_localId_fkey" FOREIGN KEY ("localId") REFERENCES "locais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_auxiliares" ADD CONSTRAINT "_auxiliares_A_fkey" FOREIGN KEY ("A") REFERENCES "cultos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_auxiliares" ADD CONSTRAINT "_auxiliares_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_vocal" ADD CONSTRAINT "_vocal_A_fkey" FOREIGN KEY ("A") REFERENCES "cultos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_vocal" ADD CONSTRAINT "_vocal_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CultoToHino" ADD CONSTRAINT "_CultoToHino_A_fkey" FOREIGN KEY ("A") REFERENCES "cultos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CultoToHino" ADD CONSTRAINT "_CultoToHino_B_fkey" FOREIGN KEY ("B") REFERENCES "hinos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CultoToMensagem" ADD CONSTRAINT "_CultoToMensagem_A_fkey" FOREIGN KEY ("A") REFERENCES "cultos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CultoToMensagem" ADD CONSTRAINT "_CultoToMensagem_B_fkey" FOREIGN KEY ("B") REFERENCES "mensagens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CultoToLeituraBiblica" ADD CONSTRAINT "_CultoToLeituraBiblica_A_fkey" FOREIGN KEY ("A") REFERENCES "cultos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CultoToLeituraBiblica" ADD CONSTRAINT "_CultoToLeituraBiblica_B_fkey" FOREIGN KEY ("B") REFERENCES "leituras_biblicas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participantes" ADD CONSTRAINT "_participantes_A_fkey" FOREIGN KEY ("A") REFERENCES "ensaios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participantes" ADD CONSTRAINT "_participantes_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnsaioToHino" ADD CONSTRAINT "_EnsaioToHino_A_fkey" FOREIGN KEY ("A") REFERENCES "ensaios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnsaioToHino" ADD CONSTRAINT "_EnsaioToHino_B_fkey" FOREIGN KEY ("B") REFERENCES "hinos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
