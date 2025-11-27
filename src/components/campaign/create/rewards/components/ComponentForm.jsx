import { useState, useRef, useEffect } from "react"
import Button from "@/components/common/Button"
import Input from "@/components/common/Input"
import Checkbox from "@/components/common/Checkbox"
import { storageApi } from "@/api/storageApi"
import toast from 'react-hot-toast'

export default function ItemForm({
  item,
  rewards,
  onSave,
  onCancel,
  campaignId,
  isLoading,
  fieldErrors = {},
  disablePriceField = false,
}) {
  const [formData, setFormData] = useState(
    item || {
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
    },
  )
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

  // Update formData when item prop changes (for edit mode)
  useEffect(() => {
    if (item) {
      console.log('ItemForm received item:', item)
      setFormData(item)
    }
  }, [item])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]

    if (!file) {
      toast.error('Chưa chọn tệp ảnh')
      return
    }

    try {
      setIsUploadingImage(true)
      toast.loading('Đang tải ảnh lên...', { id: 'upload-component-image' })

      // Gọi API upload
      const response = await storageApi.uploadSingleFile(file, 'catalog-items')
      console.log('Upload response:', response)

      if (response?.data?.data?.fileUrl) {
        const imageUrl = response.data.data.fileUrl
        setFormData(prev => ({ ...prev, imageUrl: imageUrl }))
        console.log('Image uploaded successfully:', imageUrl)
        toast.success('Tải ảnh lên thành công!', { id: 'upload-component-image' })
      } else {
        toast.error('Không lấy được URL ảnh sau khi tải lên', { id: 'upload-component-image' })
      }
    } catch (error) {
      console.error('Upload error:', error)
      console.error('Response data:', error.response?.data)
      toast.error(error.response?.data?.errors?.[0]?.message || 'Lỗi tải ảnh lên', { id: 'upload-component-image' })
    } finally {
      setIsUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Call onSave without validation - let backend handle it
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {item ? "Chỉnh sửa thành phần" : "Tạo thành phần mới"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tên<span className="text-lg font-bold text-primary">*</span>
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ví dụ: Sách in, Sticker set"
              className={fieldErrors.name ? 'border-red-500 focus:ring-red-500' : ''}
            />
            {fieldErrors.name && <p className="mt-1 text-sm text-destructive">{fieldErrors.name}</p>}
            <div className="flex items-start gap-2 p-3 mt-4 bg-primary/10 border-l-4 border-primary">
              <p className="text-sm text-foreground">
                Tên cần ngắn gọn, mô tả đúng 'một món hàng' (SKU). Ảnh nên theo tỉ lệ 3:2 để hiển thị đẹp.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Mô tả<span className="text-lg font-bold text-primary">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả chi tiết về thành phần..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${fieldErrors.description ? 'border-red-500 focus:ring-red-500' : 'border-border'
                }`}
            />
            {fieldErrors.description && <p className="mt-1 text-sm text-destructive">{fieldErrors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Giá (VND)<span className="text-lg font-bold text-primary">*</span>
            </label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                min="1"
                step="1"
                onWheel={(e) => e.target.blur()}
                disabled={disablePriceField}
                className={`flex-1 ${fieldErrors.price ? 'border-red-500 focus:ring-red-500' : ''} ${disablePriceField ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800' : ''}`}
              />
              <div className="flex-shrink-0 min-w-[180px] px-4 py-2 bg-primary/10 border border-primary/30 rounded-sm">
                <p className="text-sm font-semibold text-primary text-right">
                  {new Intl.NumberFormat('vi-VN').format(formData.price || 0)} VND
                </p>
              </div>
            </div>
            {fieldErrors.price && <p className="mt-1 text-sm text-destructive">{fieldErrors.price}</p>}
            {disablePriceField && (
              <p className="mt-1 text-xs text-muted-foreground">
                Không thể thay đổi giá của thành phần đã tồn tại khi chiến dịch đang tạm dừng/hoạt động/thành công.
              </p>
            )}
          </div>

          {/* Image Section */}
          <div>
            <h4 className="text-md font-semibold text-foreground mb-4">Hình ảnh</h4>

            {/* Upload Area - Only show when no image */}
            {!formData.imageUrl && (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-2xl">
                  <div className="border-2 border-dashed border-border rounded-sm p-8 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <Button
                        variant="gradient"
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="px-6 py-3 border border-border rounded-sm text-foreground bg-background hover:bg-muted transition-colors font-medium"
                      >
                        {isUploadingImage ? "Đang tải lên..." : "Tải ảnh lên"}
                      </Button>

                      <p className="text-md text-muted-foreground">Chọn một tệp.</p>

                      <p className="text-xs text-muted-foreground">
                        Thông số kỹ thuật hình ảnh: JPG, PNG, GIF hoặc WEBP, tỷ lệ 16:9, tối thiểu 1024 × 576 pixel, tối đa 50 MB
                      </p>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* Image Preview - Only show when image exists */}
            {formData.imageUrl && (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-2xl">
                  <div className="relative aspect-video rounded-sm overflow-hidden bg-muted border border-border">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-3 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 border border-border rounded-sm text-foreground bg-background hover:bg-muted transition-colors text-sm font-medium"
                    >
                      Thay đổi
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-4 py-2 border border-destructive text-destructive rounded-sm hover:bg-destructive/10 transition-colors text-sm font-medium"
                    >
                      Xóa ảnh
                    </button>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
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

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading || isUploadingImage}>
            Hủy
          </Button>
          <Button type="submit" variant="gradient" disabled={isLoading || isUploadingImage}>
            {isLoading ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </div>
    </form>
  )
}
