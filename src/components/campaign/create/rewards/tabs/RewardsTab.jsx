import { useState, useRef, useEffect } from "react"
import { rewardApi } from "@/api/rewardApi"
import { catalogItemApi } from "@/api/catalogItemApi"
import RewardList from "../rewards/RewardList"
import RewardForm from "../rewards/RewardForm"
import RewardPreview from "../rewards/RewardPreview"
import toast from 'react-hot-toast'

export default function RewardTiersTab({ campaignId }) {
  const [rewards, setRewards] = useState([])
  const [items, setItems] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingReward, setEditingReward] = useState(null)
  const [previewReward, setPreviewReward] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const formRef = useRef(null)

  useEffect(() => {
    if (campaignId) {
      fetchRewards()
      fetchCatalogItems()
    }
  }, [campaignId])

  const fetchRewards = async () => {
    try {
      setIsLoading(true)
      const response = await rewardApi.getRewardsWithItems(campaignId)

      if (response?.data?.data?.content) {
        setRewards(response.data.data.content)
      }
    } catch (err) {
      console.error("Error fetching rewards:", err)
      toast.error(err.message || "Không thể tải danh sách phần thưởng")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCatalogItems = async () => {
    try {
      const response = await catalogItemApi.getCatalogItems(campaignId)

      if (response?.data?.data?.content) {
        setItems(response.data.data.content)
      }
    } catch (err) {
      console.error("Error fetching catalog items:", err)
    }
  }

  const handleCreate = () => {
    setEditingReward(null)
    setPreviewReward(null)
    setFieldErrors({})
    setIsFormOpen(true)
  }

  const handleEdit = async (reward) => {
    try {
      toast.loading('Đang tải chi tiết phần thưởng...', { id: 'fetch-reward-detail' })

      const response = await rewardApi.getRewardById(campaignId, reward.rewardId)

      if (response?.data?.data) {
        const detailData = {
          ...response.data.data,
          shipping: response.data.data.shipsTo?.includes("Trên toàn cầu") ? "anywhere" : "custom",
        }

        setEditingReward(detailData)
        setPreviewReward(null)
        setFieldErrors({})
        setIsFormOpen(true)
        toast.success('Đã tải chi tiết phần thưởng', { id: 'fetch-reward-detail' })
      } else {
        toast.error('Không nhận được dữ liệu từ server', { id: 'fetch-reward-detail' })
      }
    } catch (err) {
      console.error("Error fetching reward details:", err)
      toast.error(err.message || "Không thể tải chi tiết phần thưởng", { id: 'fetch-reward-detail' })
    }
  }

  const handleSave = async (reward) => {
    setFieldErrors({})

    try {
      setIsLoading(true)

      const payload = {
        title: reward.title,
        description: reward.description,
        imageUrl: reward.imageUrl,
        estimatedDelivery: reward.estimatedDelivery,
        rewardStatus: reward.rewardStatus || "AVAILABLE",
      }

      if (reward.shipping === "anywhere") {
        payload.shipsTo = ["Trên toàn cầu"]
      } else if (reward.shipping === "custom" && reward.shipsTo && reward.shipsTo.length > 0) {
        payload.shipsTo = reward.shipsTo.map(country => country.niceName)
      } else {
        payload.shipsTo = []
      }

      const toastId = editingReward ? 'update-reward' : 'create-reward'
      const loadingMsg = editingReward ? 'Đang cập nhật phần thưởng...' : 'Đang tạo phần thưởng...'
      const successMsg = editingReward ? 'Cập nhật phần thưởng thành công!' : 'Tạo phần thưởng thành công!'

      toast.loading(loadingMsg, { id: toastId })

      let response
      if (editingReward && editingReward.rewardId) {
        const changedPayload = {}
        Object.keys(payload).forEach(key => {
          if (payload[key] !== editingReward[key]) {
            changedPayload[key] = payload[key]
          }
        })

        response = await rewardApi.updateReward(
          campaignId,
          editingReward.rewardId,
          changedPayload
        )
      } else {
        response = await rewardApi.createReward(campaignId, payload)
      }

      if (response?.data?.data?.rewardId) {
        await handleUpsertItems(response.data.data.rewardId, reward)

        await fetchRewards()

        toast.success(successMsg, { id: toastId })
      } else {
        toast.error('Không nhận được phản hồi từ server', { id: toastId })
      }

      setIsFormOpen(false)
      setEditingReward(null)
      setPreviewReward(null)

    } catch (error) {
      const toastId = editingReward ? 'update-reward' : 'create-reward'

      if (error.errors && Array.isArray(error.errors)) {
        const errors = error.errors
        const newFieldErrors = {}

        errors.forEach(err => {
          if (err.field) {
            newFieldErrors[err.field] = err.message
          }
        })

        setFieldErrors(newFieldErrors)
        toast.error(
          errors.length === 1
            ? errors[0].message
            : 'Vui lòng kiểm tra lại thông tin',
          { id: toastId }
        )
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message, { id: toastId })
      } else if (error.message) {
        toast.error(error.message, { id: toastId })
      } else {
        toast.error('Đã xảy ra lỗi không xác định', { id: toastId })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpsertItems = async (rewardId, reward) => {
    try {
      // Convert includedItems array to object { catalogItemId: quantity }
      if (reward.items?.included && reward.items.included.length > 0) {
        const itemQuantities = {}
        reward.items.included.forEach(item => {
          itemQuantities[item.catalogItemId] = item.quantity || 1
        })

        const includedPayload = {
          rewardItemType: "INCLUDED",
          itemQuantities
        }

        await rewardApi.upsertCatalogItemsToReward(campaignId, rewardId, includedPayload)
      }

      // Convert addOnItems array to object { catalogItemId: quantity }
      if (reward.items?.addOn && reward.items.addOn.length > 0) {
        const itemQuantities = {}
        reward.items.addOn.forEach(item => {
          itemQuantities[item.catalogItemId] = 0
        })

        const addOnPayload = {
          rewardItemType: "ADD_ON",
          itemQuantities
        }

        await rewardApi.upsertCatalogItemsToReward(campaignId, rewardId, addOnPayload)
      }
    } catch (err) {
      console.error("Error upserting items:", err)
      toast.error("Lưu thành phần thất bại: " + (err.message || "Lỗi không xác định"))
    }
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingReward(null)
    setPreviewReward(null)
    setFieldErrors({})
  }

  const handleDelete = async (rewardId) => {
    try {
      setIsLoading(true)

      const toastId = 'delete-reward'
      toast.loading('Đang xóa phần thưởng...', { id: toastId })

      await rewardApi.deleteReward(campaignId, rewardId)

      setRewards(prevRewards =>
        prevRewards.filter(r => r.rewardId !== rewardId)
      )
      toast.success('Xóa phần thưởng thành công!', { id: toastId })
    } catch (err) {
      console.error("Error deleting reward:", err)
      toast.error(err.message || "Không thể xóa phần thưởng", { id: 'delete-reward' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDuplicate = (reward) => {
    console.log('Duplicating reward:', reward)
    const duplicated = {
      ...reward,
      rewardId: null,
      title: `${reward.title} (Bản sao)`,
    }
    setEditingReward(duplicated)
    setPreviewReward(duplicated)
    setFieldErrors({})
    setIsFormOpen(true)
  }

  const handleFormChange = (reward) => {
    setPreviewReward(reward)
  }

  return (
    <div>
      {!isFormOpen ? (
        <RewardList
          rewards={rewards}
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onCreate={handleCreate}
          isLoading={isLoading}
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <RewardForm
              ref={formRef}
              reward={editingReward}
              items={items}
              rewards={rewards}
              campaignId={campaignId}
              onSave={handleSave}
              onCancel={handleCancel}
              onChange={handleFormChange}
              fieldErrors={fieldErrors}
            />
          </div>
          <div className="lg:w-96">
            <RewardPreview reward={previewReward || editingReward} items={items} />
          </div>
        </div>
      )}
    </div>
  )
}
