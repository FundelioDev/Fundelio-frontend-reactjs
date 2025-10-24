import { useState, useRef } from "react"
import Button from "../ui/button"
import Input from "../ui/input"
import Checkbox from "../ui/checkbox"

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
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {item ? "Chỉnh sửa thành phần" : "Tạo thành phần mới"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tiêu đề *</label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ví dụ: Sách in, Sticker set"
              error={errors.title}
            />
            {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
            <p className="mt-2 text-xs text-muted-foreground">
              💡 Tên cần ngắn gọn, mô tả đúng 'một món hàng' (SKU). Ảnh nên theo tỉ lệ 3:2 để hiển thị đẹp.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Ảnh</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  Chọn ảnh
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              {formData.image && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, image: null }))}
                  className="px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                >
                  Xóa ảnh
                </button>
              )}
            </div>
            {formData.image && (
              <div className="mt-3 aspect-video rounded-lg overflow-hidden bg-muted">
                <img src={formData.image || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {rewards.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Gán vào phần thưởng (tùy chọn)</label>
              <div className="space-y-2">
                {rewards.map((reward) => (
                  <Checkbox
                    key={reward.id}
                    checked={formData.rewardRefs.includes(reward.id)}
                    onChange={() => handleRewardToggle(reward.id)}
                    label={reward.title}
                  />
                ))}
              </div>
            </div>
          )}

          {rewards.length === 0 && (
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">💡 Chưa có Reward, bạn có thể tạo ở tab Reward tiers</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button onClick={onCancel} variant="secondary">
          Hủy
        </Button>
        <Button type="submit" variant="primary">
          {item ? "Cập nhật" : "Tạo mới"}
        </Button>
      </div>
    </form>
  )
}
