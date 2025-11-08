import { httpService } from './http';

export const storageApi = {
    /**
     * Upload a single file
     * @param file - File to be uploaded
     * @param folderName - Name of the folder where the file will be stored
     * @returns Promise with upload response
     */
    uploadSingleFile(file, folderName) {
        const formData = new FormData();
        console.log('Uploading file:', file);
        console.log('Uploading file in storageApi:', file, file instanceof File);

        formData.append('file', file);
        formData.append('folderName', folderName);

        return httpService.post('/storage/aws-s3/upload/single', formData, {
            requireToken: true,
        });

    },

    /**
     * Upload multiple files
     * @param files - Array of files to be uploaded
     * @param folderName - Name of the folder where the files will be stored
     * @returns Promise with upload response
     */
    uploadMultipleFiles(
        files,
        folderName
    ) {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append('files', file);
        });

        formData.append('folderName', folderName);

        return httpService.post('/storage/aws-s3/upload/multiple', formData, {
            requireToken: true,
        });
    },

    deleteSingleFile(filePath) {
        const relativePath = extractRelativePath(filePath);
        return httpService.delete('/storage/aws-s3/delete/single', {
            params: {
                filePath: relativePath,
            },
        });
    },
};