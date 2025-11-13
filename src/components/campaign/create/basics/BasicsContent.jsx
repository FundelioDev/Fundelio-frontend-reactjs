import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Button from '@/components/common/Button';
import Checkbox from '@/components/common/Checkbox';
import TermsCreator from './TermsCreator';
import toast from 'react-hot-toast';
import { setBasics } from '@/store/campaignSlice';
import { storageApi } from '@/api/storageApi';
import { campaignApi } from '@/api/campaignApi';
import { useCategories } from '@/hooks/useCategories';

// Category label mapping for Vietnamese
const CATEGORY_LABELS = {
  ART: 'Nghệ thuật',
  DESIGN: 'Thiết kế',
  FASHION: 'Thời trang',
  FILM: 'Phim & Video',
  FOOD: 'Thực phẩm & Thủ công',
  GAMES: 'Trò chơi',
  MUSIC: 'Nhạc',
  PHOTOGRAPHY: 'Nhiếp ảnh',
  PUBLISHING: 'Xuất bản',
  TECHNOLOGY: 'Công nghệ',
  OTHER: 'Khác',
};

export default function BasicsContent({ campaignId, isEditMode = false }) {
  const dispatch = useDispatch();
  const basicsData = useSelector((state) => state.campaign.basics);

  // Use custom hook for categories with error handling
  const { categories: categoriesData, loading: loadingCategories, error: categoriesError, refetch: refetchCategories } = useCategories();

  // Initialize with empty state to avoid loading sample data
  const [formData, setFormData] = useState({
    campaignId: campaignId || '', // Include campaignId
    title: '',
    description: '',
    goalAmount: '',
    campaignCategory: '',
    introImageUrl: '',
    introVideoUrl: '',
    startTime: '',
    endTime: '',
    acceptedTerms: false,
  });
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Show error toast if categories fail to load
  useEffect(() => {
    if (categoriesError) {
      toast.error('Không thể tải danh sách danh mục. Vui lòng thử lại.');
    }
  }, [categoriesError]);

  // Initialize with default dates if empty
  useEffect(() => {
    if (!formData.startTime || !formData.endTime) {
      const today = new Date();
      const endTime = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days from now

      setFormData(prev => ({
        ...prev,
        startTime: today.toISOString().split('T')[0],
        endTime: endTime.toISOString().split('T')[0],
      }));
    }
  }, []);

  // Initialize formData from Redux when basicsData is loaded (edit mode)
  useEffect(() => {
    if (isEditMode && basicsData.title && !isInitialized) {
      setFormData(basicsData);
      setIsInitialized(true);
    }
  }, [isEditMode, basicsData, isInitialized]); // Sync only once when data loads

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user makes changes
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    // Clear previous errors
    setFieldErrors({});

    try {
      const startTimeISO = new Date(formData.startTime).toISOString();
      const endTimeISO = new Date(formData.endTime).toISOString();

      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        goalAmount: Number(formData.goalAmount),
        campaignCategory: formData.campaignCategory,
        introImageUrl: formData.introImageUrl || undefined,
        introVideoUrl: formData.introVideoUrl || undefined,
        startTime: startTimeISO,
        endTime: endTimeISO,
      };

      // Remove undefined fields
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

      const toastId = isEditMode ? 'update-campaign' : 'create-campaign';
      const loadingMsg = isEditMode ? 'Đang cập nhật chiến dịch...' : 'Đang tạo chiến dịch...';
      const successMsg = isEditMode ? 'Cập nhật chiến dịch thành công!' : 'Tạo chiến dịch thành công!';

      toast.loading(loadingMsg, { id: toastId });

      // Call API to create or update campaign
      const response = isEditMode && campaignId
        ? await campaignApi.updateCampaign(campaignId, payload)
        : await campaignApi.createCampaign(payload);

      if (response?.data?.data) {
        const responseData = response.data.data;
        const updatedFormData = {
          ...formData,
          campaignId: responseData.campaignId,
          title: responseData.title || formData.title,
          description: responseData.description || formData.description,
          goalAmount: responseData.goalAmount || formData.goalAmount,
          campaignCategory: responseData.campaignCategory || formData.campaignCategory,
          introImageUrl: responseData.introImageUrl || formData.introImageUrl,
          introVideoUrl: responseData.introVideoUrl || formData.introVideoUrl,
          startTime: responseData.startTime ? new Date(responseData.startTime).toISOString().split('T')[0] : formData.startTime,
          endTime: responseData.endTime ? new Date(responseData.endTime).toISOString().split('T')[0] : formData.endTime,
        };

        // Update local state
        setFormData(updatedFormData);

        // Save merged data to Redux
        dispatch(setBasics(updatedFormData));
        toast.success(successMsg, { id: toastId });
      } else {
        toast.error('Không nhận được phản hồi từ server', { id: toastId });
      }
    } catch (error) {
      const toastId = isEditMode ? 'update-campaign' : 'create-campaign';

      // Handle backend validation errors
      if (error.errors && Array.isArray(error.errors)) {
        const errors = error.errors;
        const newFieldErrors = {};

        // Map backend errors to field errors
        errors.forEach(err => {
          if (err.field) {
            newFieldErrors[err.field] = err.message;
          }
        });

        setFieldErrors(newFieldErrors);

        const errorCount = errors.length;
        toast.error(
          errorCount === 1
            ? errors[0].message
            : `Vui lòng kiểm tra lại thông tin`,
          { id: toastId }
        );
      } else if (error.response?.data?.message) {
        // Handle single message error from backend
        console.log('Backend message error:', error.response.data.message);
        toast.error(error.response.data.message, { id: toastId });
      } else if (error.message) {
        // Handle network or other errors
        console.log('Network/Other error:', error.message);
        toast.error(error.message, { id: toastId });
      } else {
        // Final fallback
        console.log('Unknown error format');
        toast.error('Đã xảy ra lỗi không xác định', { id: toastId });
      }
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      toast.error('Chưa chọn tệp ảnh');
      return;
    }

    try {
      setIsUploadingImage(true);
      toast.loading('Đang tải ảnh lên...', { id: 'upload-image' });

      // Gọi API upload
      const response = await storageApi.uploadSingleFile(file, 'campaigns/images');
      console.log('Upload response:', response);

      if (response?.data?.data?.fileUrl) {
        const imageUrl = response.data.data.fileUrl;
        setFormData(prev => ({ ...prev, introImageUrl: imageUrl }));
        console.log('Image uploaded successfully:', imageUrl);
        toast.success('Tải ảnh lên thành công!', { id: 'upload-image' });
      } else {
        toast.error('Không lấy được URL ảnh sau khi tải lên', { id: 'upload-image' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Response data:', error.response?.data);
      toast.error(error.response?.data?.errors?.[0]?.message || 'Lỗi tải ảnh lên', { id: 'upload-image' });
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };


  const handleVideoChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      toast.error('Chưa chọn tệp video');
      return;
    }

    try {
      setIsUploadingVideo(true);
      toast.loading('Đang tải video lên...', { id: 'upload-video' });

      // Gọi API upload
      const response = await storageApi.uploadSingleFile(file, 'campaigns/videos');
      console.log('Upload video response:', response);

      if (response?.data?.data?.fileUrl) {
        const videoUrl = response.data.data.fileUrl;
        setFormData(prev => ({ ...prev, introVideoUrl: videoUrl }));
        console.log('Video uploaded successfully:', videoUrl);
        toast.success('Tải video lên thành công!', { id: 'upload-video' });
      } else {
        toast.error('Không lấy được URL video sau khi tải lên', { id: 'upload-video' });
      }
    } catch (error) {
      console.error('Upload video error:', error);
      console.error('Response data:', error.response?.data);
      toast.error(error.response?.data?.errors?.[0]?.message || 'Lỗi tải video lên', { id: 'upload-video' });
    } finally {
      setIsUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Title & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">Tiêu đề dự án</h3>
          <p className="text-md text-muted-foreground">
            Viết một tiêu đề ngắn gọn, súc tích để giúp mọi người nhanh chóng hiểu về dự án của bạn.
            Cả hai sẽ xuất hiện trên trang dự án và trang khởi chạy trước.
          </p>
          <p className="text-md text-muted-foreground mt-3">
            Các <strong>nhà tài trợ tiềm năng</strong> cũng sẽ thấy chúng nếu <strong>dự án</strong> của bạn xuất hiện trên các trang danh mục,
            kết quả tìm kiếm hoặc trong email chúng tôi gửi đến <strong>cộng đồng</strong> của mình.
          </p>
        </div>

        <div className="bg-white dark:bg-darker-2 border border-border rounded-sm p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-md font-medium text-text-primary dark:text-white mb-2">
                Tiêu đề <span className="text-primary">*</span>
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Papercuts: A Party Game for the Rude and Well-Read"
                maxLength={60}
                className={fieldErrors.title ? 'border-red-500 focus:ring-red-500' : ''}
              />
              <div className="flex justify-between items-center mt-1">
                {fieldErrors.title && (
                  <span className="text-xs text-red-500">{fieldErrors.title}</span>
                )}
                <span className={`text-xs text-muted-foreground ${fieldErrors.title ? 'ml-auto' : ''}`}>
                  {formData.title.length}/60
                </span>
              </div>
            </div>

            <div>
              <label className="block text-md font-medium text-text-primary dark:text-white mb-2">
                Mô tả ngắn <span className="text-primary">*</span>
              </label>
              <Textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Papercuts is a rowdy card game about books and writing brought to you by Electric Literature."
                rows={3}
                maxLength={135}
                className={fieldErrors.description ? 'border-red-500 focus:ring-red-500' : ''}
              />
              <div className="flex justify-between items-center mt-1">
                {fieldErrors.description && (
                  <span className="text-xs text-red-500">{fieldErrors.description}</span>
                )}
                <span className={`text-xs text-muted-foreground ${fieldErrors.description ? 'ml-auto' : ''}`}>
                  {(formData.description || '').length}/135
                </span>
              </div>
            </div>

            <div>
              <label className="block text-md font-medium text-text-primary dark:text-white mb-2">
                Mục tiêu gây quỹ (VND) <span className="text-primary">*</span>
              </label>
              <Input
                type="number"
                name="goalAmount"
                value={formData.goalAmount || ''}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                placeholder="10000"
                min="1"
                className={fieldErrors.goalAmount ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {fieldErrors.goalAmount ? (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.goalAmount}</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  Số tiền tối thiểu bạn cần để thực hiện dự án (tối thiểu 1 VND)
                </p>
              )}
            </div>

            <div className="flex items-start gap-2 p-3 bg-primary/10 border-l-4 border-primary">
              <p className="text-sm text-text-primary dark:text-white">
                Tạo ấn tượng đầu tiên tốt nhất cho <strong>nhà tài trợ</strong> với tiêu đề tuyệt vời.
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-12 border-t border-border" />

      {/* Section 2: Category */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">Danh mục</h3>
          <p className="text-md text-muted-foreground">
            Chọn <strong>danh mục</strong> phù hợp nhất cho <strong>dự án</strong> của bạn.
            Điều này giúp mọi người dễ dàng tìm thấy <strong>dự án</strong> của bạn.
          </p>
        </div>

        <div className="bg-white dark:bg-darker-2 border border-border rounded-sm p-6">
          <label className="block text-md font-medium text-text-primary dark:text-white mb-2">
            Danh mục dự án <span className="text-primary">*</span>
          </label>
          <select
            name="campaignCategory"
            value={formData.campaignCategory}
            onChange={handleChange}
            disabled={loadingCategories}
            className={`w-full px-4 py-2 border rounded-sm bg-background text-text-primary dark:text-white focus:ring-2 focus:border-transparent transition-all ${fieldErrors.campaignCategory
              ? 'border-red-500 focus:ring-red-500'
              : 'border-border focus:ring-primary'
              }`}
          >
            <option value="">
              {loadingCategories ? 'Đang tải...' : categoriesError ? 'Lỗi khi tải danh mục' : 'Chọn danh mục'}
            </option>
            {categoriesData.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.name}
              </option>
            ))}
          </select>
          {categoriesError && (
            <button
              onClick={refetchCategories}
              className="text-xs text-primary hover:underline mt-1"
            >
              Thử lại
            </button>
          )}
          {fieldErrors.campaignCategory && (
            <p className="text-xs text-red-500 mt-1">{fieldErrors.campaignCategory}</p>
          )}
        </div>
      </div>

      <hr className="my-12 border-t border-border" />

      {/* Section 3: Project Image */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">Ảnh dự án</h3>
          <p className="text-md text-muted-foreground mb-3">
            Thêm một <strong>hình ảnh đại diện</strong> rõ ràng cho <strong>dự án</strong> của bạn.
            Chọn một <strong>hình ảnh</strong> trông đẹp ở các kích thước khác nhau—nó sẽ xuất hiện trên trang <strong>dự án</strong> của bạn,
            trên trang web Kickstarter và ứng dụng di động, và (khi được chia sẻ) trên các kênh <strong>mạng xã hội</strong>.
          </p>
          <p className="text-md text-muted-foreground mb-3">
            Hình ảnh của bạn phải có kích thước ít nhất 1024×576 pixel.
            Nó sẽ được cắt theo tỷ lệ 16:9.
          </p>
          <p className="text-sm text-primary font-medium">
            Tránh <strong>hình ảnh</strong> có <strong>banner</strong>, <strong>huy hiệu</strong> hoặc <strong>văn bản</strong>—chúng khó đọc ở kích thước nhỏ hơn,
            có thể bị phạt bởi <strong>thuật toán Facebook</strong> và giảm cơ hội có được các <strong>tính năng trang chủ</strong>
            và <strong>bản tin</strong> của Kickstarter.
          </p>
        </div>

        <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
          <h3 className="text-md font-semibold text-text-primary dark:text-white mb-4">Hình ảnh <span className="text-primary">*</span></h3>

          {/* Upload Area - Only show when no image */}
          {!formData.introImageUrl && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-2xl">
                <div className="border-2 border-dashed border-border rounded-sm p-8 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Button
                      type="button"
                      variant="gradient"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="px-6 py-3 border border-border rounded-sm text-text-primary dark:text-white bg-background hover:bg-muted transition-colors font-medium"
                    >
                      {isUploadingImage ? 'Đang tải lên...' : 'Tải ảnh lên'}
                    </Button>

                    <p className="text-md text-muted-foreground">Chọn một tệp.</p>

                    <p className="text-xs text-muted-foreground">
                      Thông số kỹ thuật hình ảnh: JPG, PNG, GIF hoặc WEBP, tỷ lệ 16:9, tối thiểu 1024 × 576 pixel, tối đa 50 MB
                    </p>
                  </div>
                </div>

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Image Preview - Only show when image exists */}
          {formData.introImageUrl && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-2xl">
                <div className="relative aspect-video rounded-sm overflow-hidden bg-muted border border-border">
                  <img
                    src={formData.introImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-3 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="px-4 py-2 border border-border rounded-sm text-text-primary dark:text-white bg-background hover:bg-muted transition-colors text-sm font-medium"
                  >
                    Thay đổi
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, introImageUrl: null }))}
                    className="px-4 py-2 border border-destructive text-destructive rounded-sm hover:bg-destructive/10 transition-colors text-sm font-medium"
                  >
                    Xóa ảnh
                  </button>
                </div>
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          )}

          <div className="p-3 border-l-4 border-primary bg-primary/10 mt-4">
            <p className="text-xs text-muted-foreground">
              Cho <strong>nhà tài trợ</strong> thấy họ sẽ nhận được gì từ sự hỗ trợ của mình. <strong>Hình ảnh</strong> nên{" "}
              <span className="text-primary">chân thực</span>, và tránh <strong>banner</strong>, <strong>huy hiệu</strong> hoặc <strong>văn bản</strong> chồng lên.
            </p>
          </div>
        </div>
      </div>

      <hr className="my-12 border-t border-border" />

      {/* Section 4: Project Video */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">Video dự án (tùy chọn)</h3>
          <p className="text-md text-muted-foreground mb-3">
            Thêm một <strong>video</strong> mô tả <strong>dự án</strong> của bạn.
          </p>
          <p className="text-md text-muted-foreground mb-3">
            Hãy cho mọi người biết bạn đang gây quỹ để làm gì,
            bạn có kế hoạch thực hiện nó như thế nào, bạn là ai,
            và tại sao bạn quan tâm đến dự án này.
          </p>
          <p className="text-md text-muted-foreground">
            Sau khi bạn tải <strong>video</strong> lên, hãy sử dụng trình chỉnh sửa của chúng tôi
            để thêm <strong>chú thích</strong> và <strong>phụ đề</strong> để <strong>dự án</strong> của bạn dễ tiếp cận hơn với mọi người.
          </p>
        </div>

        <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
          <h3 className="text-md font-semibold text-text-primary dark:text-white mb-4">Video giới thiệu</h3>

          {/* Upload Area - Only show when no video */}
          {!formData.introVideoUrl && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-2xl">
                <div className="border-2 border-dashed border-border rounded-sm p-8 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Button
                      type="button"
                      variant="gradient"
                      onClick={() => videoInputRef.current?.click()}
                      disabled={isUploadingVideo}
                      className="px-6 py-3 border border-border rounded-sm text-text-primary dark:text-white bg-background hover:bg-muted transition-colors font-medium"
                    >
                      {isUploadingVideo ? 'Đang tải lên...' : 'Tải lên video'}
                    </Button>

                    <p className="text-md text-muted-foreground">Chọn một tệp video.</p>

                    <p className="text-xs text-muted-foreground">
                      Thông số kỹ thuật video: MP4, MOV, AVI hoặc WEBM, tỷ lệ 16:9, tối đa 500 MB
                    </p>
                  </div>
                </div>

                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Video Preview - Only show when video exists */}
          {formData.introVideoUrl && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-2xl">
                <div className="relative aspect-video rounded-sm overflow-hidden bg-muted border border-border">
                  <video
                    src={formData.introVideoUrl}
                    className="w-full h-full object-cover"
                    controls
                  />
                </div>
                <div className="mt-3 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="px-4 py-2 border border-border rounded-sm text-text-primary dark:text-white bg-background hover:bg-muted transition-colors text-sm font-medium"
                  >
                    Thay đổi
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, introVideoUrl: null }))}
                    className="px-4 py-2 border border-destructive text-destructive rounded-sm hover:bg-destructive/10 transition-colors text-sm font-medium"
                  >
                    Xóa video
                  </button>
                </div>
              </div>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
              />
            </div>
          )}
          <div className="p-3 border-l-4 border-primary bg-primary/10 mt-4">
            <p className="text-xs text-muted-foreground ">
              Hãy cho mọi người biết bạn đang gây quỹ để làm gì, bạn có kế hoạch thực hiện nó như thế nào, bạn là ai, và tại sao bạn quan tâm đến dự án này.
            </p>
          </div>

        </div>
      </div>

      <hr className="my-12 border-t border-border" />

      {/* Section 5: Campaign Duration */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">Thời gian chiến dịch</h3>
          <p className="text-md text-muted-foreground">
            Chọn ngày bắt đầu và kết thúc cho <strong>chiến dịch gây quỹ</strong> của bạn.
            Hầu hết các <strong>chiến dịch</strong> thành công kéo dài từ 30-60 ngày.
          </p>
        </div>

        <div className="bg-white dark:bg-darker-2 border border-border rounded-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-md font-medium text-text-primary dark:text-white mb-2">
                Ngày bắt đầu <span className="text-primary">*</span>
              </label>
              <Input
                type="date"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={fieldErrors.startTime ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {fieldErrors.startTime && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.startTime}</p>
              )}
            </div>

            <div>
              <label className="block text-md font-medium text-text-primary dark:text-white mb-2">
                Ngày kết thúc <span className="text-primary">*</span>
              </label>
              <Input
                type="date"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                min={formData.startTime}
                className={fieldErrors.endTime ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {fieldErrors.endTime && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.endTime}</p>
              )}
            </div>
          </div>

          {formData.startTime && formData.endTime && (
            <div className="mt-4 p-3 bg-primary/10 border-l-4 border-primary">
              <p className="text-sm text-text-primary dark:text-white">
                <span className="font-medium"><strong>Thời gian chiến dịch</strong>:</span>{' '}
                {Math.ceil((new Date(formData.endTime) - new Date(formData.startTime)) / (1000 * 60 * 60 * 24))} ngày
              </p>
            </div>
          )}
        </div>
      </div>

      <hr className="my-12 border-t border-border" />

      {/* Section 6: Terms Acceptance */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">Điều khoản dịch vụ</h3>
          <p className="text-md text-muted-foreground">
            Vui lòng đọc và chấp nhận <strong>Điều khoản dịch vụ dành cho Creator</strong> của Fundelio trước khi tiếp tục.
          </p>
        </div>

        <div className="bg-white dark:bg-darker-2 border border-border rounded-sm p-6">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={formData.acceptedTerms}
              onChange={(checked) =>
                setFormData(prev => ({ ...prev, acceptedTerms: checked }))
              }
              label={
                <span className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Tôi chấp nhận{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsTermsModalOpen(true);
                    }}
                    className="text-primary hover:text-primary-600 dark:hover:text-primary-400 underline font-medium transition-colors"
                  >
                    Điều khoản dịch vụ của Fundelio dành cho Người sáng tạo
                  </button>
                  .
                </span>
              }
            />
          </div>

          {!formData.acceptedTerms && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Bạn cần chấp nhận điều khoản dịch vụ để có thể tiếp tục tạo dự án.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Terms Modal */}
      <TermsCreator
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-border">
        <Button
          variant="gradient"
          size="lg"
          onClick={handleSave}
          className="px-8"
        >
          {isEditMode ? 'Lưu thay đổi' : 'Tạo chiến dịch'}
        </Button>
      </div>
    </div>
  );
}
