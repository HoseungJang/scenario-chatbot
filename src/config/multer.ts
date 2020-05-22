import * as multer from "multer";
import * as path from "path";

export default multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "src/uploads/");
        },
        filename: (req, file, cb) => {
            cb(null, new Date().valueOf() + path.extname(file.originalname));
        }
    })
});