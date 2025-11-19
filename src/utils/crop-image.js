/**
 * Tạo ảnh đã được cắt từ ảnh gốc và vùng cắt
 * @param {string} imageSrc - URL của ảnh gốc
 * @param {Object} cropArea - Vùng cắt với tọa độ x, y, width, height
 * @param {number} cropArea.x - Tọa độ x
 * @param {number} cropArea.y - Tọa độ y
 * @param {number} cropArea.width - Chiều rộng
 * @param {number} cropArea.height - Chiều cao
 * @returns {Promise<Blob | null>} - Blob của ảnh đã cắt hoặc null nếu có lỗi
 */
export const getCroppedImg = async (imageSrc, cropArea) => {
	try {
		const image = await createImage(imageSrc);
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			return null;
		}

		// Đảm bảo kích thước tối thiểu
		let minWidth = cropArea.width;
		let minHeight = cropArea.height;

		// Kiểm tra nếu kích thước quá nhỏ, tăng kích thước canvas
		// Điều này giúp đảm bảo file size sẽ lớn hơn 1KB
		const MIN_DIMENSION = 200; // Kích thước tối thiểu để đảm bảo file > 1KB

		if (minWidth < MIN_DIMENSION || minHeight < MIN_DIMENSION) {
			// Giữ tỷ lệ khung hình
			const aspectRatio = cropArea.width / cropArea.height;

			if (aspectRatio >= 1) {
				// Ảnh ngang hoặc vuông
				minWidth = Math.max(minWidth, MIN_DIMENSION);
				minHeight = minWidth / aspectRatio;
			} else {
				// Ảnh dọc
				minHeight = Math.max(minHeight, MIN_DIMENSION);
				minWidth = minHeight * aspectRatio;
			}
		}

		// Thiết lập kích thước canvas theo giá trị mới
		canvas.width = Math.round(minWidth);
		canvas.height = Math.round(minHeight);

		// Vẽ phần ảnh được cắt lên canvas
		ctx.drawImage(
			image,
			cropArea.x,
			cropArea.y,
			cropArea.width,
			cropArea.height,
			0,
			0,
			canvas.width,
			canvas.height
		);

		// Chuyển canvas thành blob với chất lượng cao
		return new Promise((resolve, reject) => {
			const tryQuality = (quality) => {
				canvas.toBlob(
					(blob) => {
						if (!blob) {
							reject(new Error('Không thể tạo blob từ canvas'));
							return;
						}

						// Kiểm tra kích thước blob
						if (blob.size < 1024 && quality < 1) {
							// Nếu kích thước < 1KB và chất lượng chưa đạt tối đa,
							// tăng chất lượng và thử lại
							tryQuality(Math.min(quality + 0.1, 1));
						} else {
							resolve(blob);
						}
					},
					'image/jpeg',
					quality
				);
			};

			// Bắt đầu với chất lượng 0.95 (95%)
			tryQuality(0.95);
		});
	} catch (error) {
		console.error('Error cropping image:', error);
		return null;
	}
};

/**
 * Tạo đối tượng Image từ URL
 * @param {string} url - URL của ảnh
 * @returns {Promise<HTMLImageElement>} - Đối tượng Image đã tải
 */
const createImage = (url) =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener('load', () => resolve(image));
		image.addEventListener('error', (error) => reject(error));
		image.setAttribute('crossOrigin', 'anonymous'); // Cho phép xử lý ảnh từ các nguồn khác
		image.src = url;
	});

