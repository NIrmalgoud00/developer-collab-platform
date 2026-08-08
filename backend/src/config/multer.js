const fs = require("fs");
const path = require("path");
const multer = require("multer");
const ApiError = require("../utils/ApiError");

const createUploader = ({
    destination,
    maxSize = 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes = [],
}) => {
    const uploadPath = path.join(__dirname, "..", destination);

    // Create directory if not exists
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath);
        },

        filename: (req, file, cb) => {
            const extension = path.extname(file.originalname);

            const fileName = `${Date.now()}-${Math.round(
                Math.random() * 1e9
            )}${extension}`;

            cb(null, fileName);
        },
    });

    const fileFilter = (req, file, cb) => {
        if (
            allowedMimeTypes.length &&
            !allowedMimeTypes.includes(file.mimetype)
        ) {
            return cb(
                new ApiError(
                    400,
                    `Unsupported file type: ${file.mimetype}`
                )
            );
        }

        cb(null, true);
    };

    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: maxSize,
        },
    });
};

module.exports = {
    createUploader,
};