const { PrismaClient } = require("@prisma/client");

let prisma;

function getPrismaClient() {
    if (!prisma) {
        prisma = new PrismaClient();
    }
    return prisma;
}

module.exports = { getPrismaClient };

// Close the Prisma Client connection when your application exits.
process.on("beforeExit", () => {
    if (prisma) {
        prisma.$disconnect();
    }
});
