const express = require('express');
const { query, validationResult } = require('express-validator');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const Photo = require('../models/Photo');
const User = require('../models/User');

const router = express.Router();

const MAX_PHOTOS_PER_USER = 100;

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(e => e.msg);
    return res.status(400).json({ success: false, message: messages[0], errors: messages });
  }
  next();
};

router.post(
  '/upload',
  protect,
  (req, res, next) => {
    upload.single('photo')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: `File too large. Maximum size is ${parseInt(process.env.MAX_FILE_SIZE) / (1024 * 1024)}MB.`
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please select an image to upload.'
        });
      }

      const user = await User.findById(req.user._id);
      if (user.photoCount >= MAX_PHOTOS_PER_USER) {
        await cloudinary.uploader.destroy(req.file.filename);
        return res.status(400).json({
          success: false,
          message: `You have reached the maximum limit of ${MAX_PHOTOS_PER_USER} photos. Delete some to upload more.`
        });
      }

      const photo = await Photo.create({
        userId: req.user._id,
        originalName: req.file.originalname,
        cloudinaryId: req.file.filename,
        cloudinaryUrl: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size
      });

      await User.findByIdAndUpdate(req.user._id, { $inc: { photoCount: 1 } });

      res.status(201).json({
        success: true,
        message: 'Photo uploaded successfully.',
        photo: {
          id: photo._id,
          originalName: photo.originalName,
          cloudinaryUrl: photo.cloudinaryUrl,
          mimeType: photo.mimeType,
          size: photo.size,
          createdAt: photo.createdAt
        }
      });
    } catch (error) {
      if (req.file && req.file.filename) {
        try { await cloudinary.uploader.destroy(req.file.filename); } catch (e) { /* ignore */ }
      }
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during upload. Please try again.'
      });
    }
  }
);

router.get(
  '/',
  protect,
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be 1-50'),
    query('userId').optional().isMongoId().withMessage('Invalid user ID')
  ],
  validate,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;

      let filter = {};
      if (req.user.role === 'admin') {
        if (req.query.userId) {
          filter.userId = req.query.userId;
        }
      } else {
        filter.userId = req.user._id;
      }

      const [photos, total] = await Promise.all([
        Photo.find(filter)
          .populate('userId', 'name email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Photo.countDocuments(filter)
      ]);

      res.json({
        success: true,
        photos: photos.map(p => ({
          id: p._id,
          originalName: p.originalName,
          cloudinaryUrl: p.cloudinaryUrl,
          mimeType: p.mimeType,
          size: p.size,
          createdAt: p.createdAt,
          url: p.cloudinaryUrl,
          uploadedBy: p.userId ? { id: p.userId._id, name: p.userId.name, email: p.userId.email } : null
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasMore: page * limit < total
        }
      });
    } catch (error) {
      console.error('Fetch photos error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error fetching photos.'
      });
    }
  }
);

router.delete('/:id', protect, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found.'
      });
    }

    const isOwner = photo.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this photo.'
      });
    }

    await cloudinary.uploader.destroy(photo.cloudinaryId);

    await Photo.findByIdAndDelete(req.params.id);

    if (isOwner) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { photoCount: -1 } });
    }

    res.json({
      success: true,
      message: 'Photo deleted successfully.'
    });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting photo.'
    });
  }
});

module.exports = router;
