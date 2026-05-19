import { prisma } from '../config/db.js';
import logger from '../config/logger.js';
export const getStats = async (_req, res) => {
    try {
        const totalRequests = await prisma.request.count();
        const totalTreated = await prisma.request.count({ where: { status: 'treated' } });
        const totalPending = await prisma.request.count({ where: { status: 'pending' } });
        const revenueStats = await prisma.request.aggregate({
            _sum: { amount: true },
            where: { status: 'treated' }
        });
        const topAdminsRaw = await prisma.$queryRaw `
      SELECT "Users".username, COUNT("Requests".id) as handledCount
      FROM "Requests"
      JOIN "Users" ON "Requests"."treatedBy" = "Users"."id"
      WHERE "Requests"."status" = 'treated'
      GROUP BY "Users"."id"
      ORDER BY handledCount DESC
      LIMIT 5
    `;
        const topAdmins = topAdminsRaw.map(admin => ({
            username: admin.username,
            handledCount: Number(admin.handledCount)
        }));
        const completionRate = totalRequests > 0 ? ((totalTreated / totalRequests) * 100).toFixed(1) : 0;
        const ispGroups = await prisma.request.groupBy({
            by: ['isp'],
            _count: { id: true }
        });
        const ispTrends = ispGroups.map(g => ({
            name: g.isp,
            value: g._count.id
        }));
        const revenueIspGroups = await prisma.request.groupBy({
            by: ['isp'],
            _sum: { amount: true },
            where: { status: 'treated' }
        });
        const revenueByIsp = revenueIspGroups.map(g => ({
            name: g.isp,
            revenue: g._sum.amount || 0
        }));
        const treatedRequests = await prisma.request.findMany({
            where: { status: 'treated', createdAt: { not: null }, updatedAt: { not: null } },
            select: { createdAt: true, updatedAt: true }
        });
        let totalHours = 0;
        let validTreatedCount = 0;
        treatedRequests.forEach((req) => {
            if (req.updatedAt && req.createdAt && req.updatedAt.getTime() > req.createdAt.getTime()) {
                const diffMs = req.updatedAt.getTime() - req.createdAt.getTime();
                totalHours += diffMs / (1000 * 60 * 60);
                validTreatedCount++;
            }
        });
        const averageCompletionTimeHours = validTreatedCount > 0 ? (totalHours / validTreatedCount).toFixed(1) : 0;
        res.json({
            totalRequests,
            totalTreated,
            totalPending,
            totalRevenue: revenueStats._sum.amount || 0,
            topAdmins,
            completionRate,
            ispTrends,
            revenueByIsp,
            averageCompletionTimeHours
        });
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to fetch stats');
        res.status(500).json({ error: error.message });
    }
};
//# sourceMappingURL=stats.controller.js.map