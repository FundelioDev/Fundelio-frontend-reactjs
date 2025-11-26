import { useState, useRef, useEffect, useCallback } from "react"
import { rewardApi } from "@/api/rewardApi"
import { catalogItemApi } from "@/api/catalogItemApi"
import RewardList from "../rewards/RewardList"
import RewardForm from "../rewards/RewardForm"
import RewardPreview from "../rewards/RewardPreview"
import toast from 'react-hot-toast'

export default function RewardTiersTab({
  campaignId,
  isReadOnly = false,
  rewardRules = {},
  initialOldRewardIdsRef,
}) {
  const [rewards, setRewards] = useState([])
  const [items, setItems] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingReward, setEditingReward] = useState(null)
  const [previewReward, setPreviewReward] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const formRef = useRef(null)
  const fallbackInitialRewardIdsRef = useRef(new Set())
  const initialRewardIdsRef = initialOldRewardIdsRef || fallbackInitialRewardIdsRef
  const rewardsRef = useRef([])

  const markExistingAsOld = Boolean(rewardRules?.markExistingAsOld)
  const protectOldRewards = Boolean(rewardRules?.preventDeletingOldRewards)
  const lockOldRewardItems = Boolean(rewardRules?.preventOldRewardItemUpserts)

  const prevMarkExistingRef = useRef(markExistingAsOld)

  useEffect(() => {
    console.log('[RewardsTab] state snapshot', {
      campaignId,
      markExistingAsOld,
      protectOldRewards,
      lockOldRewardItems,
      trackedOldRewardCount: initialRewardIdsRef.current.size,
    })
    return () => {
      console.log('[RewardsTab] cleanup snapshot', {
        campaignId,
        markExistingAsOld,
        finalOldRewardCount: initialRewardIdsRef.current.size,
      })
    }
  }, [campaignId, markExistingAsOld, protectOldRewards, lockOldRewardItems, initialRewardIdsRef])

  const decorateRewards = useCallback((rawRewards = []) => {
    if (!Array.isArray(rawRewards)) return []

    if (!markExistingAsOld) {
      console.log('[RewardsTab] decorateRewards skip old tagging', {
        incomingCount: rawRewards.length,
        markExistingAsOld,
      })
      return rawRewards.map(reward => ({ ...reward, isOld: false }))
    }

    if (initialRewardIdsRef.current.size === 0) {
      const seededIds = rawRewards
        .map(reward => reward.rewardId)
        .filter(Boolean)
      initialRewardIdsRef.current = new Set(seededIds)
      console.log('[RewardsTab] decorateRewards seeded initial ids from fetch', {
        seededCount: seededIds.length,
      })
    }

    const decorated = rawRewards.map(reward => ({
      ...reward,
      isOld: initialRewardIdsRef.current.has(reward.rewardId),
    }))
    const oldCount = decorated.filter(reward => reward.isOld).length
    console.log('[RewardsTab] decorateRewards applied tags', {
      incomingCount: rawRewards.length,
      trackedOldCount: initialRewardIdsRef.current.size,
      appliedOldCount: oldCount,
    })
    return decorated
  }, [markExistingAsOld])

  useEffect(() => {
    rewardsRef.current = rewards
  }, [rewards])

  useEffect(() => {
    if (!Array.isArray(rewards)) return
    const oldCount = rewards.filter(reward => reward.isOld).length
    console.log('[RewardsTab] rewards state updated', {
      totalRewards: rewards.length,
      oldCount,
      markExistingAsOld,
    })
  }, [rewards, markExistingAsOld])

  useEffect(() => {
    if (!markExistingAsOld) return
    const latestRewards = rewardsRef.current || []
    if (latestRewards.length === 0) return
    const alreadyDecorated = latestRewards.some(reward => reward.isOld)

    if (initialRewardIdsRef.current.size === 0) {
      const seededIds = latestRewards
        .map(reward => reward.rewardId)
        .filter(Boolean)

      if (seededIds.length > 0) {
        console.log('[RewardsTab] lazy seeding old reward ids from local rewards', {
          seededCount: seededIds.length,
        })
        initialRewardIdsRef.current = new Set(seededIds)
      }
    }

    if (!alreadyDecorated && initialRewardIdsRef.current.size > 0) {
      setRewards(prevRewards =>
        prevRewards.map(reward => ({
          ...reward,
          isOld: initialRewardIdsRef.current.has(reward.rewardId),
        }))
      )
    }
  }, [rewards, markExistingAsOld])

  useEffect(() => {
    const wasMarking = prevMarkExistingRef.current
    if (!wasMarking && markExistingAsOld) {
      const latestRewards = rewardsRef.current || []
      if (latestRewards.length > 0) {
        if (initialRewardIdsRef.current.size === 0) {
          const seededIds = latestRewards
            .map(reward => reward.rewardId)
            .filter(Boolean)
          console.log('[RewardsTab] toggled markExistingAsOld ON, seeding ids', {
            seededCount: seededIds.length,
          })
          initialRewardIdsRef.current = new Set(seededIds)
        }
        console.log('[RewardsTab] toggled markExistingAsOld ON, reapplying old flags', {
          trackedOldCount: initialRewardIdsRef.current.size,
          latestRewardCount: latestRewards.length,
        })
        setRewards(prevRewards =>
          prevRewards.map(reward => ({
            ...reward,
            isOld: initialRewardIdsRef.current.has(reward.rewardId),
          }))
        )
      }
    } else if (wasMarking && !markExistingAsOld) {
      console.log('[RewardsTab] toggled markExistingAsOld OFF, clearing tracked ids')
      initialRewardIdsRef.current = new Set()
      setRewards(prevRewards => prevRewards.map(reward => ({ ...reward, isOld: false })))
    }

    prevMarkExistingRef.current = markExistingAsOld
  }, [markExistingAsOld])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleCampaignSubmitted = (event) => {
      if (!campaignId) return
      if (String(event.detail?.campaignId) !== String(campaignId)) return

      const latestRewards = rewardsRef.current || []
      console.log('[RewardsTab] campaign submitted, locking current rewards as old', {
        campaignId,
        latestRewardCount: latestRewards.length,
      })
      initialRewardIdsRef.current = new Set(latestRewards.map(reward => reward.rewardId))
      setRewards(prevRewards => prevRewards.map(reward => ({ ...reward, isOld: true })))
    }

    window.addEventListener('campaign:submitted-for-review', handleCampaignSubmitted)
    return () => window.removeEventListener('campaign:submitted-for-review', handleCampaignSubmitted)
  }, [campaignId])

  useEffect(() => {
    if (campaignId) {
      fetchRewards()
      fetchCatalogItems()
    }
  }, [campaignId])

  useEffect(() => {
    if (isReadOnly) {
      setIsFormOpen(false)
      setEditingReward(null)
      setPreviewReward(null)
      setFieldErrors({})
    }
  }, [isReadOnly])

  const fetchRewards = async () => {
    try {
      setIsLoading(true)
      const response = await rewardApi.getRewardsWithItems(campaignId)

      if (response?.data?.data?.content) {
        const decorated = decorateRewards(response.data.data.content)
        setRewards(decorated)
        console.log('[RewardsTab] fetched rewards', {
          totalFetched: decorated.length,
          oldCount: decorated.filter(reward => reward.isOld).length,
          trackedOldCount: initialRewardIdsRef.current.size,
        })
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
    if (isReadOnly) return
    setEditingReward(null)
    setPreviewReward(null)
    setFieldErrors({})
    setIsFormOpen(true)
  }

  const handleEdit = async (reward) => {
    if (isReadOnly) return
    try {
      toast.loading('Đang tải chi tiết phần thưởng...', { id: 'fetch-reward-detail' })

      const response = await rewardApi.getRewardById(campaignId, reward.rewardId)

      if (response?.data?.data) {
        const detailData = {
          ...response.data.data,
          shipping: response.data.data.shipsTo?.includes("Trên toàn cầu") ? "anywhere" : "custom",
          isOld: reward?.isOld || false,
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
    if (isReadOnly) return
    setFieldErrors({})

    try {
      setIsLoading(true)
      const isEditingOldReward = Boolean(lockOldRewardItems && editingReward?.isOld)

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
        if (!isEditingOldReward) {
        await handleUpsertItems(response.data.data.rewardId, reward)
        }

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
    if (isReadOnly) return

    if (protectOldRewards) {
      const targetReward = rewards.find(reward => reward.rewardId === rewardId)
      if (targetReward?.isOld) {
        toast.error('Không thể xóa phần thưởng đã tồn tại trong trạng thái này.')
        return
      }
    }

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
    if (isReadOnly) return
    console.log('Duplicating reward:', reward)
    const duplicated = {
      ...reward,
      rewardId: null,
      title: `${reward.title} (Bản sao)`,
      isOld: false,
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
          isReadOnly={isReadOnly}
          rewardRules={rewardRules}
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
              rewardRules={rewardRules}
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
