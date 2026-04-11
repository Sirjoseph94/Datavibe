-- CreateTable
CREATE TABLE "IspBundles" (
    "id" SERIAL NOT NULL,
    "network" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IspBundles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requests" (
    "id" SERIAL NOT NULL,
    "subscriberId" INTEGER,
    "phoneNumber" TEXT NOT NULL,
    "isp" TEXT NOT NULL,
    "dataBundle" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reference" TEXT,
    "status" TEXT DEFAULT 'pending',
    "treatedBy" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Requests_reference_key" ON "Requests"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_Users_1" ON "Users"("username");

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_treatedBy_fkey" FOREIGN KEY ("treatedBy") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
