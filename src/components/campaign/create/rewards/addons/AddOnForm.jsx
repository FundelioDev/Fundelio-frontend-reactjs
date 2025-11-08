import { useState, useRef } from "react"
import Button from "@/components/common/Button"
import Input from "@/components/common/Input"
import Checkbox from "@/components/common/Checkbox"
import ItemSelector from "@/components/common/ItemSelector"

export default function AddOnForm({ addon, items, rewards, onSave, onCancel, onChange }) {
  const [formData, setFormData] = useState(
    addon || {
      id: `a${Date.now()}`,
      title: "",
      price: 0,
      image: null,
      items: [],
      delivery: { month: new Date().getMonth() + 1, year: new Date().getFullYear() },
      offeredWithRewardIds: [],
      limitTotal: null,
    },
  )
  const [errors, setErrors] = useState({})
  const [showItemSelector, setShowItemSelector] = useState(false)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value
    setFormData((prev) => ({ ...prev, [name]: newValue }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
    onChange({ ...formData, [name]: newValue })
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newData = {
          ...formData,
          image: event.target?.result,
        }
        setFormData(newData)
        onChange(newData)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRewardToggle = (rewardId) => {
    const newData = {
      ...formData,
      offeredWithRewardIds: formData.offeredWithRewardIds.includes(rewardId)
        ? formData.offeredWithRewardIds.filter((id) => id !== rewardId)
        : [...formData.offeredWithRewardIds, rewardId],
    }
    setFormData(newData)
    onChange(newData)
  }

  const handleItemsChange = (selectedItems) => {
    const newData = {
      ...formData,
      items: selectedItems,
    }
    setFormData(newData)
    onChange(newData)
    setShowItemSelector(false)
  }

  const handleDeliveryChange = (field, value) => {
    const newData = {
      ...formData,
      delivery: { ...formData.delivery, [field]: Number.parseInt(value) },
    }
    setFormData(newData)
    onChange(newData)
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc"
    }
    if (formData.price <= 0) {
      newErrors.price = "Giá phải lớn hơn 0"
    }
    if (formData.items.length === 0) {
      newErrors.items = "Phải chọn ít nhất 1 thành phần"
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

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 4 }, (_, i) => currentYear + i)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basics Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Cơ bản</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tiêu đề *</label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ví dụ: Poster bổ sung"
              error={errors.title}
            />
            {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Giá (CA$) *</label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.01"
              error={errors.price}
            />
            {errors.price && <p className="mt-1 text-sm text-destructive">{errors.price}</p>}
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Hình ảnh</h3>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-border rounded-sm text-foreground hover:bg-muted transition-colors"
          >
            Chọn ảnh
          </button>
          {formData.image && (
            <button
              type="button"
              onClick={() => {
                const newData = { ...formData, image: null }
                setFormData(newData)
                onChange(newData)
              }}
              className="px-4 py-2 border border-destructive text-destructive rounded-sm hover:bg-destructive/10 transition-colors"
            >
              Xóa ảnh
            </button>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        {formData.image && (
          <div className="mt-3 aspect-video rounded-sm overflow-hidden bg-muted">
            <img src={formData.image || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Items Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Thành phần</h3>
        <div className="space-y-4">
          <Button type="button" onClick={() => setShowItemSelector(true)} variant="secondary" className="w-full">
            Chọn thành phần
          </Button>

          {errors.items && <p className="text-sm text-destructive">{errors.items}</p>}

          {formData.items.length > 0 && (
            <div className="space-y-2">
              {formData.items.map((selectedItem) => {
                const item = items.find((i) => i.id === selectedItem.itemId)
                return (
                  <div key={selectedItem.itemId} className="flex items-center justify-between p-3 bg-muted rounded-sm">
                    <span className="text-foreground font-medium">
                      {item?.title} × {selectedItem.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = formData.items.filter((i) => i.itemId !== selectedItem.itemId)
                        const newData = { ...formData, items: newItems }
                        setFormData(newData)
                        onChange(newData)
                      }}
                      className="text-destructive hover:text-destructive/80 text-sm font-medium"
                    >
                      Xóa
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delivery Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Thời gian giao dự kiến</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tháng</label>
            <select
              value={formData.delivery.month}
              onChange={(e) => handleDeliveryChange("month", e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-sm bg-background text-foreground"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  Tháng {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Năm</label>
            <select
              value={formData.delivery.year}
              onChange={(e) => handleDeliveryChange("year", e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-sm bg-background text-foreground"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Offered With Section */}
      {rewards.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Áp dụng cho phần thưởng</h3>
          <div className="space-y-2">
            {rewards.map((reward) => (
              <Checkbox
                key={reward.id}
                checked={formData.offeredWithRewardIds.includes(reward.id)}
                onChange={() => handleRewardToggle(reward.id)}
                label={reward.title}
              />
            ))}
          </div>
        </div>
      )}

      {/* Limits Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Giới hạn</h3>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Tổng số suất (tùy chọn)</label>
          <Input
            type="number"
            value={formData.limitTotal || ""}
            onChange={(e) => {
              const newData = {
                ...formData,
                limitTotal: e.target.value ? Number.parseInt(e.target.value) : null,
              }
              setFormData(newData)
              onChange(newData)
            }}
            placeholder="Không giới hạn"
            min="1"
          />
        </div>
      </div>

      {/* Item Selector Modal */}
      {showItemSelector && (
        <ItemSelector
          items={items}
          selectedItems={formData.items}
          onConfirm={handleItemsChange}
          onClose={() => setShowItemSelector(false)}
        />
      )}
    </form>
  )
}
