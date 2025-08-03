-- CreateTable
CREATE TABLE "public"."PlayerStat" (
    "id" SERIAL NOT NULL,
    "stats" JSONB NOT NULL,
    "playerId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "PlayerStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStat_playerId_gameId_key" ON "public"."PlayerStat"("playerId", "gameId");

-- AddForeignKey
ALTER TABLE "public"."PlayerStat" ADD CONSTRAINT "PlayerStat_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlayerStat" ADD CONSTRAINT "PlayerStat_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
