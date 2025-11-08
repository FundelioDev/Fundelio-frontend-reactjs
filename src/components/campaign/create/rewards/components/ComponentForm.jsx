import { useState, useRef } from "react"
import Button from "@/components/common/Button"
import Input from "@/components/common/Input"
import Checkbox from "@/components/common/Checkbox"

export default function ItemForm({ item, rewards, onSave, onCancel }) {
  const [formData, setFormData] = useState(
    item || {
      id: `item${Date.now()}`,
      title: "",
      image: null,
      rewardRefs: [],
    },
  )
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          image: event.target?.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRewardToggle = (rewardId) => {
    setFormData((prev) => ({
      ...prev,
      rewardRefs: prev.rewardRefs.includes(rewardId)
        ? prev.rewardRefs.filter((id) => id !== rewardId)
        : [...prev.rewardRefs, rewardId],
    }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSave(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {item ? "Chỉnh sửa thành phần" : "Tạo thành phần mới"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tiêu đề<span className="text-lg font-bold text-primary">*</span></label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ví dụ: Sách in, Sticker set"
              error={errors.title}
            />
            {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
            <div className="flex items-start gap-2 p-3 mt-4 bg-primary/10 border-l-4 border-primary">
              <p className="text-sm text-foreground">
                Tên cần ngắn gọn, mô tả đúng 'một món hàng' (SKU). Ảnh nên theo tỉ lệ 3:2 để hiển thị đẹp.
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div>
            <h4 className="text-md font-semibold text-foreground mb-4">Hình ảnh</h4>

            {/* Upload Area - Only show when no image */}
            {!formData.image && (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-2xl">
                  <div className="border-2 border-dashed border-border rounded-sm p-8 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <Button
                        variant="gradient"
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-3 border border-border rounded-sm text-foreground bg-background hover:bg-muted transition-colors font-medium"
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
            {formData.image && (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-2xl">
                  <div className="relative aspect-video rounded-sm overflow-hidden bg-muted border border-border">
                    <img
                      src={formData.image}
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
                      onClick={() => setFormData(prev => ({ ...prev, image: null }))}
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" variant="gradient">
            Lưu
          </Button>
        </div>
      </div>
    </form>
  )
}
