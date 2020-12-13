const express = require('express');
const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'frontend/public/images/');
  },
  filename(req, file, cb) {
    
    cb(null, file.originalname );
  },
});


const upload = multer({ storage });

const router = express.Router();
router.post('/product', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});


// aws.config.update({
//   accessKeyId: config.accessKeyId,
//   secretAccessKey: config.secretAccessKey,
// });

// const s3 = new aws.S3();
// const storageS3 = multerS3({
//   s3,
//   bucket: 'maurodmachadoimages',
//   acl: 'public-read',
//   contentType: multerS3.AUTO_CONTENT_TYPE,
//   key(req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const uploadS3 = multer({ storage: storageS3 });
// router.post('/s3', uploadS3.single('image'), (req, res) => {
//   res.send(req.file.location);
// });

module.exports = router;

