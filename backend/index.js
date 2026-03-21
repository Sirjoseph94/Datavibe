const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma, Prisma, setupDb } = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_123';

// Verify JWT Token Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Optional JWT Token Middleware for Guest checkouts
const optionalAuthenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return next();

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err) req.user = user;
    next();
  });
};

// Check Roles Middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

// Start Server
setupDb().then(() => {
  console.log('Database initialized');
  app.listen(3000, () => {
    console.log('API Server running on http://localhost:3000');
  });
}).catch(console.error);

// ----------------------------------------
// AUTHENTICATION ROUTES
// ----------------------------------------

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return res.status(400).json({ error: 'Username already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password_hash: hash,
        role: 'SUBSCRIBER'
      }
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, role: user.role, username: user.username, id: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------
// DATA BUNDLES
// ----------------------------------------

const ISP_BUNDLES = {
  MTN: [
    { network: 'MTN', size: '1GB', price: 500 },
    { network: 'MTN', size: '2GB', price: 1000 },
    { network: 'MTN', size: '3.5GB', price: 1500 },
    { network: 'MTN', size: '10GB', price: 4500 },
    { network: 'MTN', size: '20GB', price: 7500 }
  ],
  Airtel: [
    { network: 'Airtel', size: '1GB', price: 350 },
    { network: 'Airtel', size: '2GB', price: 500 },
    { network: 'Airtel', size: '4GB', price: 2500 },
    { network: 'Airtel', size: '10GB', price: 4000 },
    { network: 'Airtel', size: '20GB', price: 20000 }
  ],
  Glo: [
    { network: 'Glo', size: '1.05GB', price: 500 },
    { network: 'Glo', size: '2.9GB', price: 1000 },
    { network: 'Glo', size: '5.8GB', price: 2000 },
    { network: 'Glo', size: '10GB', price: 3000 },
    { network: 'Glo', size: '20.5GB', price: 5000 }
  ],
  '9mobile': [
    { network: '9mobile', size: '1GB', price: 1000 },
    { network: '9mobile', size: '2.5GB', price: 1200 },
    { network: '9mobile', size: '7GB', price: 2500 },
    { network: '9mobile', size: '15GB', price: 4000 }
  ]
};

app.get('/api/bundles', (req, res) => {
  res.json(ISP_BUNDLES);
});

// ----------------------------------------
// PAYSTACK INTEGRATION
// ----------------------------------------

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_1234567890abcdef1234567890abcdef';

function validateNigerianPhone(phone) {
  const normalized = String(phone).replace(/^\+?234/, '0').replace(/\s+/g, '');
  if (normalized.length !== 11 || !/^0\d{10}$/.test(normalized)) {
    return { valid: false, message: 'Please enter a valid 11-digit Nigerian phone number (e.g. 0801...)' };
  }
  return { valid: true, normalized };
}

app.post('/api/paystack/initialize', optionalAuthenticateToken, async (req, res) => {
  try {
    console.log("-------initialize paystack--------")
    const { phoneNumber, isp, dataBundle } = req.body;
    if (!phoneNumber || !isp || !dataBundle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const phoneValidation = validateNigerianPhone(phoneNumber, isp);
    if (!phoneValidation.valid) {
      return res.status(400).json({ error: phoneValidation.message });
    }
    const validatedPhone = phoneValidation.normalized;

    const selectedBundle = ISP_BUNDLES[isp]?.find(b => b.size === dataBundle);
    if (!selectedBundle) return res.status(400).json({ error: 'Invalid bundle selected' });

    const amount = selectedBundle.price;
    const subscriberId = req.user ? req.user.id : null;
    const email = req.user ? req.user.username + '@datasub.com' : `guest_${validatedPhone}@datasub.com`;

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount * 100, // kobo
        email,
        callback_url: `${process.env.FRONTEND_URL}/verify`,
        metadata: {
          phoneNumber: validatedPhone,
          isp,
          dataBundle,
          amount,
          subscriberId
        }
      })
    });

    const data = await response.json();
    if (!data.status) throw new Error(data.message);

    res.json({ authorization_url: data.data.authorization_url, reference: data.data.reference });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/paystack/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    // Identity check
    const existing = await prisma.request.findUnique({ where: { reference } });
    if (existing) return res.status(400).json({ error: 'Transaction already verified' });

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
      }
    });

    const data = await response.json();
    if (!data.status || data.data.status !== 'success') {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    const meta = data.data.metadata;
    const request = await prisma.request.create({
      data: {
        subscriberId: meta?.subscriberId === "" ? null : Number(meta?.subscriberId),
        phoneNumber: meta.phoneNumber,
        isp: meta.isp,
        dataBundle: meta.dataBundle,
        amount: Number(meta.amount),
        reference: reference,
        status: 'pending'
      }
    });


    res.json({ message: 'Payment successful and request created', request });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Transaction already verified' });
      }
    }
    console.error("error", error)
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------
// REQUESTS
// ----------------------------------------

app.post('/api/requests', optionalAuthenticateToken, async (req, res) => {
  try {
    const { phoneNumber, isp, dataBundle, amount } = req.body;
    if (!phoneNumber || !isp || !dataBundle || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const phoneValidation = validateNigerianPhone(phoneNumber, isp);
    if (!phoneValidation.valid) {
      return res.status(400).json({ error: phoneValidation.message });
    }
    const validatedPhone = phoneValidation.normalized;

    const request = await prisma.request.create({
      data: {
        subscriberId: req.user ? req.user.id : null,
        phoneNumber: validatedPhone,
        isp,
        dataBundle,
        amount
      }
    });

    res.status(201).json({ message: 'Request created', requestId: request.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's requests OR all requests if Admin/Super Admin
app.get('/api/requests', authenticateToken, async (req, res) => {
  const { status, page, limit, search, isp } = req.query;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  try {
    const where = req.user.role === 'SUBSCRIBER' ? { subscriberId: req.user.id } : {};
    if (search) {
      where.OR = [
        { phoneNumber: { contains: search, mode: 'insensitive' } },
        { subscriber: { username: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (isp) {
      where.isp = isp;
    }
    if (status) {
      where.status = status;
    }

    const [baseRequests, total] = await Promise.all([
      prisma.request.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { subscriber: true },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.request.count({ where }),
    ]);

    const requests = baseRequests.map(req => {
      const { subscriber, ...rest } = req;
      return { ...rest, subscriberName: subscriber ? subscriber.username : null };
    });

    res.json({ data: requests, total, page: pageNum, limit: limitNum });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/requests/:id/treat', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    await prisma.request.update({
      where: { id: parseInt(req.params.id, 10) },
      data: {
        status: 'treated',
        treatedBy: req.user.id,
        updatedAt: new Date()
      }
    });

    res.json({ message: 'Request treated successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------
// STATS
// ----------------------------------------

app.get('/api/stats', authenticateToken, requireRole(['SUPER_ADMIN']), async (req, res) => {
  try {
    const totalRequests = await prisma.request.count();
    const totalTreated = await prisma.request.count({ where: { status: 'treated' } });
    const totalPending = await prisma.request.count({ where: { status: 'pending' } });
    const revenueStats = await prisma.request.aggregate({
      _sum: { amount: true },
      where: { status: 'treated' }
    });

    const topAdminsRaw = await prisma.$queryRaw`
      SELECT Users.username, COUNT(Requests.id) as handledCount
      FROM Requests
      JOIN Users ON Requests.treatedBy = Users.id
      WHERE Requests.status = 'treated'
      GROUP BY Users.id
      ORDER BY handledCount DESC
      LIMIT 5
    `;

    // Convert BigInts from queryRaw back to normal Numbers
    const topAdmins = topAdminsRaw.map(admin => ({
      username: admin.username,
      handledCount: Number(admin.handledCount)
    }));

    // Calculate Completion Rate
    const completionRate = totalRequests > 0 ? ((totalTreated / totalRequests) * 100).toFixed(1) : 0;

    // Calculate ISP Trends
    const ispGroups = await prisma.request.groupBy({
      by: ['isp'],
      _count: { id: true }
    });
    const ispTrends = ispGroups.map(g => ({
      name: g.isp,
      value: g._count.id
    }));

    // Calculate Revenue By ISP
    const revenueIspGroups = await prisma.request.groupBy({
      by: ['isp'],
      _sum: { amount: true },
      where: { status: 'treated' }
    });
    const revenueByIsp = revenueIspGroups.map(g => ({
      name: g.isp,
      revenue: g._sum.amount || 0
    }));

    // Calculate Average Completion Time (in Hours)
    const treatedRequests = await prisma.request.findMany({
      where: { status: 'treated', createdAt: { not: null }, updatedAt: { not: null } },
      select: { createdAt: true, updatedAt: true }
    });

    let totalHours = 0;
    let validTreatedCount = 0;
    treatedRequests.forEach(req => {
      // Exclude requests where updatedAt is exactly createdAt (e.g. treated immediately or synthetic data issues)
      if (req.updatedAt.getTime() > req.createdAt.getTime()) {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------
// ADMIN MANAGEMENT
// ----------------------------------------

app.get('/api/admins', authenticateToken, requireRole(['SUPER_ADMIN']), async (req, res) => {
  try {
    const { search } = req.query;
    const where = search ? { username: { contains: search, mode: 'insensitive' } } : {};
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN', ...where },
      select: { id: true, username: true, createdAt: true }
    });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admins', authenticateToken, requireRole(['SUPER_ADMIN']), async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return res.status(400).json({ error: 'Username already exists' });

    const hash = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: { username, password_hash: hash, role: 'ADMIN' }
    });

    res.status(201).json({ message: 'Admin created successfully', adminId: admin.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admins/:id', authenticateToken, requireRole(['SUPER_ADMIN']), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { username, password } = req.body;

    const admin = await prisma.user.findUnique({ where: { id } });
    if (!admin || admin.role !== 'ADMIN') return res.status(404).json({ error: 'Admin not found' });

    let updateData = {};
    if (username) {
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing && existing.id !== id) return res.status(400).json({ error: 'Username already exists' });
      updateData.username = username;
    }
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id },
      data: updateData
    });

    res.json({ message: 'Admin updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admins/:id', authenticateToken, requireRole(['SUPER_ADMIN']), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const admin = await prisma.user.findUnique({ where: { id } });
    if (!admin || admin.role !== 'ADMIN') return res.status(404).json({ error: 'Admin not found' });

    // Remove foreign key references from treated requests before deletion
    await prisma.request.updateMany({
      where: { treatedBy: id },
      data: { treatedBy: null }
    });

    await prisma.user.delete({ where: { id } });
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

