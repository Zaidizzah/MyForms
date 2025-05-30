class FileUploadManager {
    constructor() {
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
        ];
    }

    /**
     * Validates file before upload
     * @param {File} file - File to validate
     * @returns {Object} - Validation result
     */
    validateFile(file) {
        if (!file) {
            return { valid: false, error: "File tidak ditemukan" };
        }

        if (!this.allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: "Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP",
            };
        }

        if (file.size > this.maxFileSize) {
            return {
                valid: false,
                error: `Ukuran file terlalu besar. Maksimal ${
                    this.maxFileSize / 1024 / 1024
                }MB`,
            };
        }

        return { valid: true };
    }

    /**
     * Handles file upload and returns base64 data
     * @param {File} file - File to upload
     * @returns {Promise<string>} - Base64 string
     */
    async uploadFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
        });
    }
}
