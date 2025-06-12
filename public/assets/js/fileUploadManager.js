class FileUploadManager {
    constructor({ uploadUrl, deleteUrl }) {
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
        ];
        this.uploadUrl = uploadUrl;
        this.deleteUrl = deleteUrl;
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
     * Uploads file to server and returns file URL
     * @param {File} file - File to upload
     * @param {string} context - Upload context ('question', 'option', etc.)
     * @returns {Promise<Object>} - Upload result with file URL
     */
    async uploadFile(file, context = "question") {
        // Initialize status element
        const uploadingStatus = CREATE_STATUS_ELEMENT("Uploading file");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("context", context);
        formData.append("timestamp", Date.now());

        try {
            const response = await fetch(this.uploadUrl, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "X-CSRF-TOKEN": CSRF_TOKEN,
                    "X-XSRF-TOKEN": XSRF_TOKEN,
                },
                body: formData,
            });

            console.log(response);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || "Upload failed");
            }

            return {
                id: result.file_id,
                url: result.file_path,
                fileName: result.file_name,
                size: result.file_size,
                type: result.file_type,
                extension: result.file_extension,
                context: result.context,
                timestamp: result.timestamp,
            };
        } catch (error) {
            console.error("File upload error:", error);
            throw new Error(`Gagal mengupload file: ${error.message}`); // Use a more user-friendly error message
        } finally {
            REMOVE_STATUS_ELEMENT(uploadingStatus);
        }
    }

    /**
     * Deletes file from server
     * @param {string} fileUrl - File URL to delete
     * @returns {Promise<boolean>} - Deletion result
     */
    async deleteFile(fileId) {
        if (!fileId) return true;

        // Initialize status element
        const deletingStatus = CREATE_STATUS_ELEMENT("Deleting file");

        try {
            const response = await fetch(this.deleteUrl, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": CSRF_TOKEN,
                    "X-XSRF-TOKEN": XSRF_TOKEN,
                },
                body: JSON.stringify({ url: fileId }),
            });

            const result = await response.json();
            return result.success || false;
        } catch (error) {
            console.error("File deletion error:", error);
            return false;
        } finally {
            REMOVE_STATUS_ELEMENT(deletingStatus);
        }
    }

    /**
     * Creates temporary preview URL for immediate display
     * @param {File} file - File to create preview for
     * @returns {string} - Temporary blob URL
     */
    createPreviewUrl(file) {
        return URL.createObjectURL(file);
    }

    /**
     * Revokes temporary preview URL to free memory
     * @param {string} url - Blob URL to revoke
     */
    revokePreviewUrl(url) {
        if (url && url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
        }
    }

    /**
     * Handles multiple file uploads with progress tracking
     * @param {FileList} files - Files to upload
     * @param {string} context - Upload context
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<Array>} - Array of upload results
     */
    async uploadMultipleFiles(files, context = "question", onProgress = null) {
        const results = [];
        const totalFiles = files.length;

        for (let i = 0; i < totalFiles; i++) {
            const file = files[i];

            try {
                const validation = this.validateFile(file);
                if (!validation.valid) {
                    results.push({
                        success: false,
                        error: validation.error,
                        fileName: file.name,
                    });
                    continue;
                }

                const result = await this.uploadFile(file, context);
                results.push(result);

                if (onProgress) {
                    onProgress({
                        completed: i + 1,
                        total: totalFiles,
                        percent: Math.round(((i + 1) / totalFiles) * 100),
                    });
                }
            } catch (error) {
                results.push({
                    success: false,
                    error: error.message,
                    fileName: file.name,
                });
            }
        }

        return results;
    }
}
