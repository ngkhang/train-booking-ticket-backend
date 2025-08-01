import * as fs from 'fs';
import * as multer from 'multer';

export const storeUploadFile = 'uploads';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync(storeUploadFile, { recursive: true });
    cb(null, storeUploadFile);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  },
});

export { storage };
