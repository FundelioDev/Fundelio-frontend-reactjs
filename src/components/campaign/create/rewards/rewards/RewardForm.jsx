import { useState, useRef, forwardRef, useImperativeHandle, useMemo, useEffect } from "react"
import Button from "@/components/common/Button"
import Input from "@/components/common/Input"
import Checkbox from "@/components/common/Checkbox"
import ItemSelector from "@/components/common/ItemSelector"
import Textarea from "@/components/common/Textarea"
import Tip from "@/components/common/Tip"
import { Switch } from "@/components/ui/switch"
import { Trash2, X } from "lucide-react"
import { storageApi } from "@/api/storageApi"
import { rewardApi } from "@/api/rewardApi"
import toast from 'react-hot-toast'

const RewardForm = forwardRef(({ reward, items, rewards, onSave, onCancel, onChange, campaignId, type = 'reward', fieldErrors = {}, rewardRules = {} }, ref) => {
  const isAddon = type === 'addon'
  const formRef = useRef(null)

  const [formData, setFormData] = useState({
    rewardId: null,
    title: "",
    description: "",
    imageUrl: null,
    shipsTo: [],
    estimatedDelivery: "",
    items: {
      included: [],
      addOn: []
    },
    shipping: isAddon ? undefined : "anywhere",
    limitTotal: null,
    rewardStatus: "AVAILABLE", // Default status
    ...reward, // Merge with existing reward data if editing
    isOld: reward?.isOld || false,
  })
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [showItemSelector, setShowItemSelector] = useState(false)
  const [showAdditionalItemSelector, setShowAdditionalItemSelector] = useState(false)
  const [countries, setCountries] = useState([])
  const [loadingCountries, setLoadingCountries] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (reward) {
      setFormData(prev => ({
        ...prev,
        ...reward,
        isOld: reward?.isOld || false,
      }))
    }
  }, [reward])

  const lockItemAssociations = Boolean(rewardRules?.preventOldRewardItemUpserts && formData?.isOld)

  // Convert shipsTo string array to country objects after countries are loaded
  useEffect(() => {
    if (countries.length > 0 && formData.shipsTo && Array.isArray(formData.shipsTo) && formData.shipsTo.length > 0) {
      const firstItem = formData.shipsTo[0]

      if (typeof firstItem === 'string' && firstItem !== "Trên toàn cầu") {
        const matchedCountries = formData.shipsTo
          .map(countryName =>
            countries.find(c => c.niceName === countryName || c.name === countryName)
          )
          .filter(Boolean) // Remove null/undefined

        if (matchedCountries.length > 0) {
          const newData = { ...formData, shipsTo: matchedCountries }
          setFormData(newData)
          if (onChange) onChange(newData)
        }
      }
    }
  }, [countries])

  const minPledgeAmount = useMemo(() => {
    const includedItems = formData.items?.included || []
    if (includedItems.length === 0) return 0

    return includedItems.reduce((total, item) => {
      return total + (item.price || 0) * (item.quantity || 1)
    }, 0)
  }, [formData.items])

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return countries
    return countries.filter(country =>
      country.niceName.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.name.toLowerCase().includes(countrySearch.toLowerCase())
    )
  }, [countries, countrySearch])

  // Fetch countries when shipping is set to custom
  useEffect(() => {
    if (formData.shipping === 'custom' && countries.length === 0) {
      setLoadingCountries(true)
      fetch('https://open.oapi.vn/location/countries')
        .then(res => res.json())
        .then(data => {
          setCountries(data.data || [])
          setLoadingCountries(false)
        })
        .catch(err => {
          console.error('Failed to fetch countries:', err)
          setLoadingCountries(false)
        })
    }
  }, [formData.shipping, countries.length])

  // Update estimatedDelivery when component mounts or when editing
  useEffect(() => {
    if (!formData.estimatedDelivery) {
      const now = new Date()
      const delivery = new Date(now.getFullYear(), now.getMonth() + 1, 20)
      const isoDate = delivery.toISOString().split('T')[0]

      const newData = { ...formData, estimatedDelivery: isoDate }
      setFormData(newData)
      if (onChange) onChange(newData)
    }
  }, [])

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

    let newData = { ...formData, [name]: newValue }

    // Reset shipsTo when switching shipping mode
    if (name === "shipping") {
      if (value === "anywhere") {
        newData.shipsTo = ["Trên toàn cầu"]
      } else if (value === "custom") {
        newData.shipsTo = []
      }
    }

    setFormData(newData)
    if (onChange) onChange(newData)
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploadingImage(true)
      toast.loading('Đang tải ảnh lên...', { id: 'upload-reward-image' })

      const response = await storageApi.uploadSingleFile(file, 'rewards')

      if (response?.data?.data?.fileUrl) {
        const newData = {
          ...formData,
          imageUrl: response.data.data.fileUrl,
        }
        setFormData(newData)
        if (onChange) onChange(newData)
        toast.success('Tải ảnh lên thành công!', { id: 'upload-reward-image' })
      } else {
        throw new Error('Không nhận được URL ảnh từ server')
      }
    } catch (error) {
      console.error('Upload image error:', error)

      let errorMessage = 'Tải ảnh lên thất bại'
      if (error.errors && Array.isArray(error.errors)) {
        errorMessage = error.errors[0]?.message || errorMessage
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage, { id: 'upload-reward-image' })
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleDeliveryChange = (value) => {
    const newData = {
      ...formData,
      estimatedDelivery: value,
    }
    setFormData(newData)
    if (onChange) onChange(newData)
  }

  const handleItemsChange = (selectedItems) => {
    if (lockItemAssociations) {
      toast.error('Không thể thay đổi thành phần cho phần thưởng đã tồn tại trong trạng thái này.')
      setShowItemSelector(false)
      return
    }
    // selectedItems is array like: [{ catalogItemId: "xxx", quantity: 2 }]
    // Map to full item objects with quantity
    const itemsWithDetails = selectedItems.map(selectedItem => {
      const fullItem = items.find(i => i.catalogItemId === selectedItem.catalogItemId)
      return {
        ...fullItem,
        quantity: selectedItem.quantity
      }
    })

    const newData = {
      ...formData,
      items: {
        ...formData.items,
        included: itemsWithDetails
      }
    }
    setFormData(newData)
    if (onChange) onChange(newData)
    setShowItemSelector(false)
  }

  const handleAdditionalItemsChange = (selectedItems) => {
    if (lockItemAssociations) {
      toast.error('Không thể thay đổi thành phần thêm cho phần thưởng đã tồn tại.')
      setShowAdditionalItemSelector(false)
      return
    }
    // For add-on items, quantity is 0 (backer will choose)
    const itemsWithDetails = selectedItems.map(selectedItem => {
      const fullItem = items.find(i => i.catalogItemId === selectedItem.catalogItemId)
      return {
        ...fullItem,
        quantity: 0
      }
    })

    const newData = {
      ...formData,
      items: {
        ...formData.items,
        addOn: itemsWithDetails
      }
    }
    setFormData(newData)
    if (onChange) onChange(newData)
    setShowAdditionalItemSelector(false)
  }

  const handleCountrySelect = (e) => {
    const countryId = e.target.value
    if (!countryId) return

    const country = countries.find(c => c.id === countryId)
    if (country && !formData.shippingCountries.find(c => c.id === countryId)) {
      const newData = {
        ...formData,
        shippingCountries: [...formData.shippingCountries, country]
      }
      setFormData(newData)
      onChange(newData)
    }
    // Reset select
    e.target.value = ''
  }

  const handleCountryToggle = (country) => {
    const isSelected = formData?.shipsTo?.find(c => c.id === country.id)

    const newData = {
      ...formData,
      shipsTo: isSelected
        ? (formData?.shipsTo || []).filter(c => c.id !== country.id)
        : [...(formData?.shipsTo || []), country]
    }
    setFormData(newData)
    if (onChange) onChange(newData)
  }

  const handleCountryRemove = (countryId) => {
    const newData = {
      ...formData,
      shipsTo: formData.shipsTo?.filter(c => c.id !== countryId)
    }
    setFormData(newData)
    if (onChange) onChange(newData)
  }

  const handleRemoveItem = async (catalogItemId, itemType) => {
    if (lockItemAssociations) {
      toast.error('Không thể xóa thành phần khỏi phần thưởng đã tồn tại trong trạng thái này.')
      return
    }
    // Find the rewardItemId for this catalog item
    const itemsArray = itemType === 'included' ? formData.items?.included : formData.items?.addOn
    const itemToRemove = itemsArray?.find(i => i.catalogItemId === catalogItemId)

    // If editing an existing reward and item has rewardItemId, call API to delete
    if (formData.rewardId && itemToRemove?.rewardItemId && campaignId) {
      try {
        await rewardApi.deleteCatalogItemsToReward(
          campaignId,
          formData.rewardId,
          [itemToRemove.rewardItemId]
        )
        toast.success('Đã xóa thành phần khỏi phần thưởng')
      } catch (error) {
        console.error('Error deleting catalog item from reward:', error)
        toast.error(error.response?.data?.message || 'Không thể xóa thành phần')
        return // Don't update local state if API call failed
      }
    }

    // Update local state
    const newItems = itemsArray?.filter(i => i.catalogItemId !== catalogItemId) || []
    const newData = {
      ...formData,
      items: {
        ...formData.items,
        [itemType]: newItems
      }
    }
    setFormData(newData)
    if (onChange) onChange(newData)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  // console.log('RewardForm formData:', formData)

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
              error={fieldErrors.title}
            />
            {fieldErrors.title && <p className="mt-1 text-sm text-destructive">{fieldErrors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Mô tả<span className="text-lg font-bold text-primary">*</span></label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả giá trị khác biệt của phần thưởng này..."
              rows={3}
              error={fieldErrors.description}
            />
            {fieldErrors.description && <p className="mt-1 text-sm text-destructive">{fieldErrors.description}</p>}
            <Tip className="mt-2">
              Tạo ấn tượng đầu tiên tốt nhất cho <strong>nhà tài trợ</strong> với tiêu đề tuyệt vời.
            </Tip>
          </div>
        </div>
      </div>

      {/* Reward Status Section */}
      <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Trạng thái phần thưởng</h3>
        <div className="flex items-center justify-between p-4 bg-muted/30 dark:bg-muted/10 rounded-lg">
          <div className="flex-1">
            <p className="font-medium text-foreground mb-1">
              {formData.rewardStatus === "AVAILABLE" ? "Đang mở bán" : "Đã hết hàng"}
            </p>
            <p className="text-sm text-muted-foreground">
              {formData.rewardStatus === "AVAILABLE"
                ? "Người ủng hộ có thể chọn phần thưởng này"
                : "Phần thưởng tạm thời không khả dụng"}
            </p>
          </div>
          <Switch
            checked={formData.rewardStatus === "AVAILABLE"}
            onCheckedChange={(checked) => {
              const newData = {
                ...formData,
                rewardStatus: checked ? "AVAILABLE" : "SOLD_OUT"
              }
              setFormData(newData)
              if (onChange) onChange(newData)
            }}
            className="ml-4"
          />
        </div>
      </div>

      {/* Image Section */}
      <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
        <h3 className="text-lg font-semibold text-foreground">Hình ảnh<span className="text-lg font-bold text-primary">*</span></h3>
        <p className="text-sm text-text-primary dark:text-white mb-4">
          Thêm hình ảnh sản phẩm của bạn để giúp người ủng hộ hiểu chính xác phần thưởng của họ là gì.
        </p>

        {/* Upload Area - Only show when no image */}
        {!formData.imageUrl && (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl">
              <div className="border-2 border-dashed border-border rounded-sm p-8 bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Button
                    type="button"
                    variant="gradient"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 border border-border rounded-sm text-foreground bg-background hover:bg-muted transition-colors font-medium"
                    disabled={isUploadingImage}
                  >
                    {isUploadingImage ? 'Đang tải lên...' : 'Tải ảnh lên'}
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
                disabled={isUploadingImage}
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
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? 'Đang tải...' : 'Thay đổi'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newData = { ...formData, imageUrl: null }
                    setFormData(newData)
                    if (onChange) onChange(newData)
                  }}
                  className="px-4 py-2 border border-destructive text-destructive rounded-sm hover:bg-destructive/10 transition-colors text-sm font-medium"
                  disabled={isUploadingImage}
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
              disabled={isUploadingImage}
            />
          </div>
        )}
        {fieldErrors.imageUrl && <p className="mt-2 text-sm text-destructive">{fieldErrors.imageUrl}</p>}
      </div>

      {/* Pricing Section */}
      <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Giá ủng hộ tối thiểu</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Giá (VND)</label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                name="minPledgeAmount"
                value={minPledgeAmount}
                placeholder="0"
                disabled
                className="flex-1 bg-black/30 cursor-not-allowed"
              />
              <div className="flex-shrink-0 min-w-[180px] px-4 py-2 bg-primary/10 border border-primary/30 rounded-sm">
                <p className="text-sm font-semibold text-primary text-right">
                  {new Intl.NumberFormat('vi-VN').format(minPledgeAmount || 0)} VND
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Giá tự động tính dựa trên tổng giá × số lượng của các thành phần bao gồm
            </p>
          </div>
        </div>
      </div>

      {/* Items Section - INCLUDED items */}
      {!isAddon && (<div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Thành phần bao gồm<span className="text-lg font-bold text-primary">*</span></h3>
        <div className="space-y-4">
          <Button
            type="button"
            onClick={() => setShowItemSelector(true)}
            variant="secondary"
            className={`w-full ${lockItemAssociations ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={lockItemAssociations}
          >
            Chọn thành phần
          </Button>

          {fieldErrors.includedItems && <p className="text-sm text-destructive">{fieldErrors.includedItems}</p>}

          {formData?.items?.included && formData.items.included.length > 0 && (
            <div className="space-y-2">
              {formData.items.included.map((item) => (
                <div key={item.catalogItemId} className="flex items-center justify-between p-3 bg-muted rounded-sm">
                  <span className="text-foreground font-medium">
                    {item.name || 'Unknown Item'} × {item.quantity || 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.catalogItemId, 'included')}
                    className={`text-destructive hover:text-destructive/80 p-1 rounded hover:bg-destructive/10 transition-colors ${lockItemAssociations ? 'opacity-60 cursor-not-allowed hover:bg-transparent hover:text-destructive' : ''}`}
                    title={lockItemAssociations ? 'Không thể xóa thành phần khỏi phần thưởng đã khóa' : 'Xóa'}
                    disabled={lockItemAssociations}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {lockItemAssociations && (
            <p className="text-xs text-muted-foreground">
              Các thành phần được khóa khi chiến dịch đang tạm dừng/hoạt động/thành công.
            </p>
          )}
          <Tip className="mt-2">Ít nhất 1 component. Mỗi component tương ứng 1 món sẽ giao cho backer.</Tip>
        </div>
      </div>
      )}

      {/* Additional Items Section - ADD_ON items */}
      {!isAddon && (<div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Thành phần thêm vào (Add-on)</h3>
        <div className="space-y-4">
          <Button
            type="button"
            onClick={() => setShowAdditionalItemSelector(true)}
            variant="secondary"
            className={`w-full ${lockItemAssociations ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={lockItemAssociations}
          >
            Chọn thành phần thêm
          </Button>

          {formData.items?.addOn && formData.items.addOn.length > 0 && (
            <div className="space-y-2">
              {formData.items.addOn.map((item) => (
                <div key={item.catalogItemId} className="flex items-center justify-between p-3 bg-muted rounded-sm">
                  <span className="text-foreground font-medium">
                    {item.name || 'Unknown Item'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.catalogItemId, 'addOn')}
                    className={`text-destructive hover:text-destructive/80 p-1 rounded hover:bg-destructive/10 transition-colors ${lockItemAssociations ? 'opacity-60 cursor-not-allowed hover:bg-transparent hover:text-destructive' : ''}`}
                    title={lockItemAssociations ? 'Không thể xóa thành phần khỏi phần thưởng đã khóa' : 'Xóa'}
                    disabled={lockItemAssociations}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {lockItemAssociations && (
            <p className="text-xs text-muted-foreground">
              Không thể thay đổi thành phần thêm của phần thưởng đã khóa.
            </p>
          )}
          <Tip className="mt-2">Thành phần tùy chọn có thể được backer thêm vào phần thưởng này. Số lượng do backer tự chọn.</Tip>
        </div>
      </div>
      )}

      {/* Delivery Section */}
      <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Thời gian giao dự kiến<span className="text-lg font-bold text-primary">*</span></h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Ngày giao hàng (YYYY-MM-DD)</label>
            <Input
              type="date"
              name="estimatedDelivery"
              value={formData.estimatedDelivery}
              onChange={(e) => handleDeliveryChange(e.target.value)}
              error={fieldErrors.estimatedDelivery}
            />
            {fieldErrors.estimatedDelivery && <p className="mt-1 text-sm text-destructive">{fieldErrors.estimatedDelivery}</p>}
            <Tip className="mt-2">
              Thời gian giao hàng ước tính giúp bạn và nhà tài trợ của bạn biết khi nào họ có thể mong đợi phần thưởng của mình.
            </Tip>
          </div>
        </div>
      </div>

      {/* Shipping Section - Only for rewards */}
      {!isAddon && (
        <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Vận chuyển<span className="text-lg font-bold text-primary">*</span></h3>
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
              <span className="text-foreground">Tùy chỉnh quốc gia</span>
            </label>

            {/* Country Selection - Show when custom is selected */}
            {formData.shipping === "custom" && (
              <div className="mt-4 space-y-3">
                <div className="relative">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Chọn quốc gia
                  </label>

                  {/* Search Input */}
                  <Input
                    type="text"
                    placeholder={loadingCountries ? "Đang tải..." : "Tìm kiếm quốc gia..."}
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    onFocus={() => setShowCountryDropdown(true)}
                    disabled={loadingCountries}
                    className="w-full"
                  />

                  {/* Dropdown with Countries */}
                  {showCountryDropdown && !loadingCountries && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowCountryDropdown(false)}
                      />

                      {/* Dropdown */}
                      <div className="absolute z-20 w-full mt-1 bg-white dark:bg-darker-2 border border-border rounded-sm shadow-lg max-h-64 overflow-y-auto scrollbar-primary">
                        {filteredCountries.length === 0 ? (
                          <div className="p-3 text-sm text-muted-foreground text-center">
                            Không tìm thấy quốc gia
                          </div>
                        ) : (
                          <div className="p-2 space-y-1">
                            {filteredCountries.map((country) => {
                              const isSelected = formData?.shipsTo?.find(c => c.id === country.id)
                              return (
                                <label
                                  key={country.id}
                                  className="flex items-center gap-3 p-2 hover:bg-muted rounded cursor-pointer transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="checkbox"
                                    checked={!!isSelected}
                                    onChange={() => handleCountryToggle(country)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-sm text-foreground flex-1">
                                    {country.niceName}
                                  </span>
                                </label>
                              )
                            })}
                          </div>
                        )}

                        {/* Footer with count */}
                        {filteredCountries.length > 0 && (
                          <div className="border-t border-border p-2 bg-muted/30">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Đã chọn: {formData?.shipsTo?.length || 0}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowCountryDropdown(false)
                                }}
                                className="text-primary hover:text-primary/80 font-medium"
                              >
                                Đóng
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Selected Countries Tags */}
                {formData.shipsTo && formData.shipsTo.length > 0 && formData.shipsTo[0] !== "Trên toàn cầu" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Quốc gia đã chọn ({formData.shipsTo.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.shipsTo.map((country) => (
                        <div
                          key={country.id}
                          className="group inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-sm font-medium text-foreground hover:bg-primary/20 transition-colors"
                        >
                          <span>{country.niceName}</span>
                          <button
                            type="button"
                            onClick={() => handleCountryRemove(country.id)}
                            className="opacity-70 group-hover:opacity-100 transition-opacity"
                            title="Xóa"
                          >
                            <X className="w-4 h-4 text-destructive hover:text-destructive/80" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {fieldErrors.shipsTo && <p className="mt-2 text-sm text-destructive">{fieldErrors.shipsTo}</p>}
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

      {/* Limits Section
      <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Giới hạn</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tổng số suất (tùy chọn)</label>
            <Input
              type="number"
              name="limitTotal"
              value={formData.limitTotal || ""}
              onChange={(e) => {
                const newData = {
                  ...formData,
                  limitTotal: e.target.value ? Number.parseInt(e.target.value) : null,
                }
                setFormData(newData)
                if (onChange) onChange(newData)
              }}
              placeholder="Không giới hạn"
              min="1"
              onWheel={(e) => e.target.blur()}
            />
          </div>
        </div>
      </div> */}

      {/* Item Selector Modal for INCLUDED items */}
      {showItemSelector && (
        <ItemSelector
          items={items}
          selectedItems={(formData.items?.included || []).map(item => ({
            catalogItemId: item.catalogItemId,
            quantity: item.quantity || 1
          }))}
          onConfirm={handleItemsChange}
          onClose={() => setShowItemSelector(false)}
        />
      )}

      {/* Additional Item Selector Modal for ADD_ON items */}
      {showAdditionalItemSelector && (
        <ItemSelector
          items={items}
          selectedItems={(formData.items?.addon || []).map(item => ({
            catalogItemId: item.catalogItemId,
            quantity: 0
          }))}
          onConfirm={handleAdditionalItemsChange}
          onClose={() => setShowAdditionalItemSelector(false)}
          isAddOnMode={true} // Pass flag to disable quantity input
        />
      )}

      {/* Action Buttons */}
      <div className="rounded-sm border border-border bg-white dark:bg-darker-2 p-6">
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit" variant="gradient">
            Lưu phần thưởng
          </Button>
        </div>
      </div>
    </form>
  )
})

RewardForm.displayName = 'RewardForm'

export default RewardForm