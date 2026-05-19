import bcrypt from 'bcrypt';
import { prisma } from '../src/config/db.js';
const ISP_BUNDLES = [
    { network: 'MTN', size: '1GB', price: 500 },
    { network: 'MTN', size: '2GB', price: 1000 },
    { network: 'MTN', size: '3.5GB', price: 1500 },
    { network: 'MTN', size: '10GB', price: 4500 },
    { network: 'MTN', size: '20GB', price: 7500 },
    { network: 'Airtel', size: '1GB', price: 350 },
    { network: 'Airtel', size: '2GB', price: 500 },
    { network: 'Airtel', size: '4GB', price: 2500 },
    { network: 'Airtel', size: '10GB', price: 4000 },
    { network: 'Airtel', size: '20GB', price: 20000 },
    { network: 'Glo', size: '1.05GB', price: 500 },
    { network: 'Glo', size: '2.9GB', price: 1000 },
    { network: 'Glo', size: '5.8GB', price: 2000 },
    { network: 'Glo', size: '10GB', price: 3000 },
    { network: 'Glo', size: '20.5GB', price: 5000 },
    { network: '9mobile', size: '1GB', price: 1000 },
    { network: '9mobile', size: '2.5GB', price: 1200 },
    { network: '9mobile', size: '7GB', price: 2500 },
    { network: '9mobile', size: '15GB', price: 4000 }
];
import { encryptConfig } from '../src/utils/encryption.js';
async function seed() {
    console.log("Starting seed for ISP Bundles...");
    for (const bundle of ISP_BUNDLES) {
        const existing = await prisma.ispBundle.findFirst({
            where: {
                network: bundle.network,
                size: bundle.size
            }
        });
        if (!existing) {
            await prisma.ispBundle.create({
                data: bundle
            });
            console.log(`Created bundle: ${bundle.network} - ${bundle.size}`);
        }
    }
    console.log("Seeding default admins...");
    // Default super admin
    const superExists = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
    if (!superExists) {
        const hash = await bcrypt.hash('super123', 10);
        await prisma.user.create({
            data: {
                username: 'superadmin',
                password_hash: hash,
                role: 'SUPER_ADMIN'
            }
        });
        console.log("Created SUPER_ADMIN");
    }
    // Default admin
    const adminExists = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!adminExists) {
        const hash = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
            data: {
                username: 'admin',
                password_hash: hash,
                role: 'ADMIN'
            }
        });
        console.log("Created ADMIN");
    }
    console.log("Seeding payment gateways...");
    const gateways = [
        {
            name: 'monnify',
            displayName: 'Monnify',
            isActive: true,
            isDefault: true,
            config: encryptConfig(JSON.stringify({
                apiKey: process.env.MONNIFY_API_KEY || "",
                secretKey: process.env.MONNIFY_SECRET_KEY || "",
                contractCode: process.env.MONNIFY_CONTRACT_CODE || "",
                isSandbox: process.env.MONNIFY_IS_SANDBOX !== 'false'
            }))
        },
        {
            name: 'paystack',
            displayName: 'Paystack',
            isActive: true,
            isDefault: false,
            config: encryptConfig(JSON.stringify({
                secretKey: process.env.PAYSTACK_SECRET_KEY || ""
            }))
        }
    ];
    for (const gw of gateways) {
        const existing = await prisma.paymentGateway.findUnique({ where: { name: gw.name } });
        if (!existing) {
            await prisma.paymentGateway.create({ data: gw });
            console.log(`Created PaymentGateway: ${gw.displayName}`);
        }
    }
    console.log("Seed complete.");
}
seed().catch((error) => {
    console.error("Error seeding data:", error);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map