import { useState, useRef, forwardRef, useImperativeHandle } from "react"
import Button from "@/components/common/Button"
import Input from "@/components/common/Input"
import Checkbox from "@/components/common/Checkbox"
import ItemSelector from "@/components/common/ItemSelector"
import Textarea from "@/components/common/Textarea"
import Tip from "@/components/common/Tip"

const RewardForm = forwardRef(({ reward, items, rewards, onSave, onCancel, onChange, type = 'reward' }, ref) => {
  const isAddon = type === 'addon'
  const formRef = useRef(null)

  const [formData, setFormData] = useState(
    reward || {
      id: isAddon ? `a${Date.now()}` : `r${Date.now()}`,
      title: "",
      description: "",
      image: null,
      price: 0,
      items: [],
      delivery: { month: new Date().getMonth() + 1, year: new Date().getFullYear() },
      shipping: isAddon ? undefined : "anywhere",
      limitTotal: null,
      limitPerBacker: isAddon ? undefined : null,
      allowAddOns: isAddon ? undefined : false,
      offeredWithRewardIds: isAddon ? [] : undefined,
    },
  )
  const [errors, setErrors] = useState({})
  const [showItemSelector, setShowItemSelector] = useState(false)
  const fileInputRef = useRef(null)

  // Expose submit method to parent via ref
  useImperativeHandle(ref, () => ({
    submit: () => {
      if (formRef.current) {
        formRef.current.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true })
        )
      }
    }
  }))

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value
    setFormData((prev) => ({ ...prev, [name]: newValue }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
    onChange({ ...formData, [name]: newValue })
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
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Basics Section */}
      <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Cơ bản</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tiêu đề<span className="text-lg font-bold text-primary">*</span></label>
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
            <Tip className="mt-2">
              Tạo ấn tượng đầu tiên tốt nhất cho <strong>nhà tài trợ</strong> với tiêu đề tuyệt vời.
            </Tip>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
        <h3 className="text-lg font-semibold text-foreground">Hình ảnh</h3>
        <p className="text-sm text-text-primary dark:text-white mb-4">
          Thêm hình ảnh sản phẩm của bạn để giúp người ủng hộ hiểu chính xác phần thưởng của họ là gì.
        </p>

        {/* Upload Area - Only show when no image */}
        {!formData.image && (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl">
              <div className="border-2 border-dashed border-border rounded-sm p-8 bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Button
                    type="button"
                    variant="gradient"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 border border-border rounded-sm text-foreground bg-background hover:bg-muted transition-colors font-medium"
                  >
                    Tải ảnh lên
                  </Button>

                  <p className="text-md text-text-primary dark:text-white">Chọn một tệp.</p>

                  <p className="text-xs text-text-primary dark:text-white">
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
                  onClick={() => {
                    const newData = { ...formData, image: null }
                    setFormData(newData)
                    onChange(newData)
                  }}
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
      </div>

      {/* Pricing Section */}
      <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Giá ủng hộ</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Giá (VND)<span className="text-lg font-bold text-primary">*</span></label>
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

          <div className="p-3 bg-muted/50 rounded-sm border border-border">
            <p className="text-sm text-text-primary dark:text-white">
              ℹ️ <strong>Thuế thu ở Pledge Manager:</strong> Để sử dụng Pledge Manager của Kickstarter, giá được đặt cho
              mỗi phần thưởng không được bao gồm thuế. Chúng tôi sẽ tính toán và thu bất kỳ thuế áp dụng nào từ mỗi
              backer dựa trên vị trí của họ, sau khi chiến dịch của bạn kết thúc.
            </p>
          </div>
        </div>
      </div>

      {/* Items Section */}
      {!isAddon && (<div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
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
          <Tip className="mt-2">Ít nhất 1 component. Mỗi component tương ứng 1 món sẽ giao cho backer.</Tip>
        </div>
      </div>
)}
      
      {/* Delivery Section */}
      <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
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
        <Tip className="mt-4">
          Thời gian giao hàng ước tính giúp bạn và nhà tài trợ của bạn biết khi nào họ có thể mong đợi phần thưởng của mình.
        </Tip>
      </div>

      {/* Shipping Section - Only for rewards */}
      {!isAddon && (
        <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
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
      )}

      {/* Offered With Section - Only for addons */}
      {isAddon && rewards && rewards.length > 0 && (
        <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Áp dụng cho phần thưởng</h3>
          <p className="text-sm text-text-primary dark:text-white mb-4">
            Chọn các phần thưởng mà add-on này có thể được thêm vào
          </p>
          <div className="space-y-2">
            {rewards.map((reward) => (
              <Checkbox
                key={reward.id}
                checked={formData.offeredWithRewardIds?.includes(reward.id) || false}
                onChange={() => handleRewardToggle(reward.id)}
                label={`${reward.title} - ${reward.price} VND`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Limits Section */}
      <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
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
          {!isAddon && (
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
          )}
        </div>
      </div>

      {/* Add-ons Section - Only for rewards */}
      {!isAddon && (
        <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
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
      )}

      {/* Item Selector Modal */}
      {showItemSelector && (
        <ItemSelector
          items={items}
          selectedItems={formData.items}
          onConfirm={handleItemsChange}
          onClose={() => setShowItemSelector(false)}
        />
      )}

      {/* Action Buttons */}
      <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" variant="gradient">
            Lưu {isAddon ? 'Add-on' : 'Phần thưởng'}
          </Button>
        </div>
      </div>
    </form>
  )
})

RewardForm.displayName = 'RewardForm'

export default RewardForm