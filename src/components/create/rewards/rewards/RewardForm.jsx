import { useState, useRef } from "react"
import Button from "../ui/button"
import Input from "../ui/input"
import Textarea from "../ui/textarea"
import Checkbox from "../ui/checkbox"
import ItemSelector from "../ui/item-selector"

export default function RewardForm({ reward, items, rewards, onSave, onCancel, onChange }) {
  const [formData, setFormData] = useState(
    reward || {
      id: `r${Date.now()}`,
      title: "",
      description: "",
      image: null,
      price: 0,
      items: [],
      delivery: { month: new Date().getMonth() + 1, year: new Date().getFullYear() },
      shipping: "anywhere",
      limitTotal: null,
      limitPerBacker: null,
      allowAddOns: false,
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

  const handleDeliveryChange = (field, value) => {
    const newData = {
      ...formData,
      delivery: { ...formData.delivery, [field]: Number.parseInt(value) },
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
              placeholder="Ví dụ: Phiên bản giới hạn có chữ ký"
              error={errors.title}
            />
            {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Mô tả (tùy chọn)</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả giá trị khác biệt của phần thưởng này..."
              rows={3}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              💡 Hãy nêu giá trị khác biệt của phần thưởng này trong 1–2 câu.
            </p>
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
            className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
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
              className="px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
            >
              Xóa ảnh
            </button>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        {formData.image && (
          <div className="mt-3 aspect-video rounded-lg overflow-hidden bg-muted">
            <img src={formData.image || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
        <p className="mt-2 text-xs text-muted-foreground">💡 Ảnh thật, không chèn chữ hoặc banner lớn.</p>
      </div>

      {/* Pricing Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Giá ủng hộ</h3>
        <div className="space-y-4">
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

          <div className="p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              ℹ️ <strong>Thuế thu ở Pledge Manager:</strong> Để sử dụng Pledge Manager của Kickstarter, giá được đặt cho
              mỗi phần thưởng không được bao gồm thuế. Chúng tôi sẽ tính toán và thu bất kỳ thuế áp dụng nào từ mỗi
              backer dựa trên vị trí của họ, sau khi chiến dịch của bạn kết thúc.
            </p>
          </div>
        </div>
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
                  <div key={selectedItem.itemId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
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

          <p className="text-xs text-muted-foreground">
            💡 Ít nhất 1 component. Mỗi component tương ứng 1 món sẽ giao cho backer.
          </p>
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
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
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
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">💡 Chọn dư thời gian để tránh giao trễ.</p>
      </div>

      {/* Shipping Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Vận chuyển</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="shipping"
              value="anywhere"
              checked={formData.shipping === "anywhere"}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-foreground">Ship toàn cầu</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="shipping"
              value="custom"
              checked={formData.shipping === "custom"}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-foreground">Tùy chỉnh (ghi chú)</span>
          </label>
        </div>
      </div>

      {/* Limits Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Giới hạn</h3>
        <div className="space-y-4">
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
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Giới hạn mỗi backer (tùy chọn)</label>
            <Input
              type="number"
              value={formData.limitPerBacker || ""}
              onChange={(e) => {
                const newData = {
                  ...formData,
                  limitPerBacker: e.target.value ? Number.parseInt(e.target.value) : null,
                }
                setFormData(newData)
                onChange(newData)
              }}
              placeholder="Không giới hạn"
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <Checkbox
          checked={formData.allowAddOns}
          onChange={(checked) => {
            const newData = { ...formData, allowAddOns: checked }
            setFormData(newData)
            onChange(newData)
          }}
          label="Cho phép Add-ons cho phần thưởng này"
        />
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

      <div className="flex gap-3 justify-end">
        <Button onClick={onCancel} variant="secondary">
          Hủy
        </Button>
        <Button type="submit" variant="primary">
          {reward ? "Cập nhật" : "Tạo mới"}
        </Button>
      </div>
    </form>
  )
}
