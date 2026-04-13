const mongoose = require('mongoose');
const multer = require('multer');

// Configure multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

let gfsBucket;

// Initialize GridFSBucket when connected
mongoose.connection.once('open', () => {
  gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'chat_attachments'
  });
  console.log('GridFSBucket initialized');
});

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    if (!gfsBucket) {
      return res.status(500).json({ success: false, message: 'GridFSBucket not initialized' });
    }

    // Create an upload stream to GridFS
    const uploadStream = gfsBucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: { uploadedBy: req.user.firebaseUid }
    });

    // Write buffer to stream
    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', () => {
      res.status(201).json({
        success: true,
        data: {
          fileId: uploadStream.id.toString(),
          fileName: req.file.originalname,
          fileType: req.file.mimetype
        }
      });
    });

    uploadStream.on('error', (err) => {
      console.error('GridFS Upload Error:', err);
      res.status(500).json({ success: false, message: 'Failed to upload file to GridFS' });
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFile = async (req, res) => {
  try {
    if (!gfsBucket) {
      return res.status(500).json({ success: false, message: 'GridFSBucket not initialized' });
    }

    const fileId = new mongoose.Types.ObjectId(req.params.id);
    
    // Find file to get metadata like content-type
    const files = await gfsBucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    const file = files[0];
    res.set('Content-Type', file.contentType);
    // res.set('Content-Disposition', `inline; filename="${file.filename}"`);
    
    const downloadStream = gfsBucket.openDownloadStream(file._id);
    downloadStream.pipe(res);

    downloadStream.on('error', (err) => {
      console.error('GridFS Download Error:', err);
      res.status(500).json({ success: false, message: 'Failed to stream file' });
    });

  } catch (error) {
    console.error('File Fetch Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadMiddleware = upload.single('file');
