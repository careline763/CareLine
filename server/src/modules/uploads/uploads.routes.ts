import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, AuthRequest } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { ok, badRequest } from '../../utils/response';
import prisma from '../../config/db';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files allowed'));
      return;
    }
    cb(null, true);
  },
});

const router = Router();
router.use(authenticate);

// Partner uploads before/after photo for a booking
router.post(
  '/booking/:id/photos',
  requireRole('partner'),
  upload.fields([
    { name: 'before_photo', maxCount: 1 },
    { name: 'after_photo', maxCount: 1 },
  ]),
  async (req: AuthRequest, res: Response) => {
    const bookingId = Number(req.params.id);
    const files = req.files as Record<string, Express.Multer.File[]>;

    const data: Record<string, string> = {};
    if (files?.before_photo?.[0]) {
      data.before_photo_url = `/uploads/${files.before_photo[0].filename}`;
    }
    if (files?.after_photo?.[0]) {
      data.after_photo_url = `/uploads/${files.after_photo[0].filename}`;
    }

    if (Object.keys(data).length === 0) {
      badRequest(res, 'No photos provided'); return;
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data,
    });

    ok(res, { booking, ...data }, 'Photos uploaded');
  }
);

// Admin: upload document
router.post('/documents', requireRole('partner'), upload.single('document'), async (req: AuthRequest, res: Response) => {
  if (!req.file) { badRequest(res, 'No file provided'); return; }
  const url = `/uploads/${req.file.filename}`;

  // Attach to partner's documents_json
  const partner = await prisma.partner.findUnique({ where: { user_id: req.user!.userId } });
  if (!partner) { badRequest(res, 'Partner profile not found'); return; }

  const docs = (partner.documents_json as Record<string, string>) ?? {};
  const docType = (req.body.type as string) ?? 'document';
  docs[docType] = url;

  await prisma.partner.update({ where: { id: partner.id }, data: { documents_json: docs } });
  ok(res, { url }, 'Document uploaded');
});

export default router;
