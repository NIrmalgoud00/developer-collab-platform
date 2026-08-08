const { createUploader } = require("./multer");

const uploadAttachment = createUploader({
    destination: "uploads/attachments",

    maxSize: 10 * 1024 * 1024,

    allowedMimeTypes: [
        "image/jpeg",
        "image/png",
        "image/webp",

        "application/pdf",

        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "text/plain",

        "application/zip",
        "application/x-zip-compressed",
    ],
});

module.exports = uploadAttachment;