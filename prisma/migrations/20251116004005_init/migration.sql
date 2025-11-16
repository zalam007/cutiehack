-- CreateTable
CREATE TABLE "World" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "summary" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Character" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "worldId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "description" TEXT,
    "personality" TEXT,
    "backstory" TEXT,
    "tags" TEXT,
    "relationships" TEXT,
    CONSTRAINT "Character_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "worldId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "description" TEXT,
    "history" TEXT,
    "connected" TEXT,
    CONSTRAINT "Location_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Magic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "worldId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT,
    "rules" TEXT,
    "limitations" TEXT,
    "costs" TEXT,
    CONSTRAINT "Magic_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Faction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "worldId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "purpose" TEXT,
    "members" TEXT,
    "conflicts" TEXT,
    CONSTRAINT "Faction_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StoryEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "worldId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "charactersInvolved" TEXT,
    "locationId" INTEGER,
    "timestamp" DATETIME,
    CONSTRAINT "StoryEvent_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
