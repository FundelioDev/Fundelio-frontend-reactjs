import { useState, useEffect, useRef } from 'react';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import { useLocalStorage } from '@/hooks/useLocalStorge';
import Button from '@/components/common/Button';
import Checkbox from '@/components/common/Checkbox';
import TermsCreator from './TermsCreator';
const CATEGORIES = [
  'Nghệ thuật',
  'Truyện tranh & Minh họa',
  'Thiết kế & Công nghệ',
  'Phim & Video',
  'Thực phẩm & Thủ công',
  'Trò chơi',
  'Nhạc',
  'Xuất bản',
];

export default function BasicsContent() {
  const { value: savedData, setValue: setSavedData } = useLocalStorage('ff:campaign-basics', null);

  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    category: '',
    image_url: null,
    intro_video_url: null,
    start_date: '',
    end_date: '',
    acceptedTerms: false,
  });

  const [mounted, setMounted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Hydrate from localStorage
  useEffect(() => {
    setMounted(true);
    if (savedData) {
      setFormData(savedData);
    } else {
      // Set default dates
      const today = new Date();
      const endDate = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days from now

      setFormData(prev => ({
        ...prev,
        start_date: today.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      }));
    }
  }, [savedData]);

  // Auto-save to localStorage with debounce
  useEffect(() => {
    if (!mounted) return;

    const timer = setTimeout(() => {
      setSavedData(formData);
    }, 500);

    return () => clearTimeout(timer);
  }, [formData, mounted, setSavedData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image_url: event.target?.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          intro_video_url: event.target?.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!mounted) return null;

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
              />
              <div className="flex justify-end mt-1">
                <span className="text-xs text-muted-foreground">{formData.title.length}/60</span>
              </div>
            </div>

            <div>
              <label className="block text-md font-medium text-text-primary dark:text-white mb-2">
                Mô tả ngắn <span className="text-primary">*</span>
              </label>
              <Textarea
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                placeholder="Papercuts is a rowdy card game about books and writing brought to you by Electric Literature."
                rows={3}
                maxLength={135}
              />
              <div className="flex justify-end mt-1">
                <span className="text-xs text-muted-foreground">{formData.desc.length}/135</span>
              </div>
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
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-sm bg-background text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="">Chọn danh mục</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
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
          {!formData.image_url && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-2xl">
                <div className="border-2 border-dashed border-border rounded-sm p-8 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Button
                      type="button"
                      variant="gradient"
                      onClick={() => imageInputRef.current?.click()}
                      className="px-6 py-3 border border-border rounded-sm text-text-primary dark:text-white bg-background hover:bg-muted transition-colors font-medium"
                    >
                      Tải ảnh lên
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
          {formData.image_url && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-2xl">
                <div className="relative aspect-video rounded-sm overflow-hidden bg-muted border border-border">
                  <img
                    src={formData.image_url}
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
                    onClick={() => setFormData(prev => ({ ...prev, image_url: null }))}
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
          {!formData.intro_video_url && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-2xl">
                <div className="border-2 border-dashed border-border rounded-sm p-8 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Button
                      type="button"
                      variant="gradient"
                      onClick={() => videoInputRef.current?.click()}
                      className="px-6 py-3 border border-border rounded-sm text-text-primary dark:text-white bg-background hover:bg-muted transition-colors font-medium"
                    >
                      Tải lên video
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
          {formData.intro_video_url && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-2xl">
                <div className="relative aspect-video rounded-sm overflow-hidden bg-muted border border-border">
                  <video
                    src={formData.intro_video_url}
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
                    onClick={() => setFormData(prev => ({ ...prev, intro_video_url: null }))}
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
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-md font-medium text-text-primary dark:text-white mb-2">
                Ngày kết thúc <span className="text-primary">*</span>
              </label>
              <Input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                min={formData.start_date}
              />
            </div>
          </div>

          {formData.start_date && formData.end_date && (
            <div className="mt-4 p-3 bg-primary/10 border-l-4 border-primary">
              <p className="text-sm text-text-primary dark:text-white">
                <span className="font-medium"><strong>Thời gian chiến dịch</strong>:</span>{' '}
                {Math.ceil((new Date(formData.end_date) - new Date(formData.start_date)) / (1000 * 60 * 60 * 24))} ngày
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
              onCheckedChange={(checked) =>
                setFormData(prev => ({ ...prev, acceptedTerms: checked }))
              }
              className="mt-1"
            />
            <div className="flex-1">
              <label className="text-sm sm:text-base text-muted-foreground leading-relaxed cursor-pointer select-none">
                Tôi chấp nhận{' '}
                <button
                  type="button"
                  onClick={() => setIsTermsModalOpen(true)}
                  className="text-primary hover:text-primary-600 dark:hover:text-primary-400 underline font-medium transition-colors"
                >
                  Điều khoản dịch vụ của Fundelio dành cho Người sáng tạo
                </button>
                .
              </label>
            </div>
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
    </div>
  );
}
