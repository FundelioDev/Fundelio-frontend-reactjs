"use client"

import { useState, useEffect } from "react"
import { catalogItemApi } from "@/api/catalogItemApi"
import { rewardApi } from "@/api/rewardApi"
import ItemList from "../components/ComponentList"
import ItemForm from "../components/ComponentForm"
import toast from 'react-hot-toast'

export default function ComponentsTab({ campaignId }) {
  const [items, setItems] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [itemRewards, setItemRewards] = useState({})

  // Fetch all catalog items on mount
  useEffect(() => {
    if (campaignId) {
      fetchCatalogItems()
    }
  }, [campaignId])

  const fetchCatalogItems = async () => {
    try {
      setIsLoading(true)
      const response = await catalogItemApi.getCatalogItems(campaignId)

      if (response.data.success && response.data) {
        // const fetchedItems = response.data?.data?.content.map(item => ({
        //   catalogItemId: item.catalogItemId,
        //   name: item.name,
        //   description: item.description,
        //   price: item.price,
        //   imageUrl: item.imageUrl,
        // }))

        // Update local state
        setItems(response.data?.data?.content)

        // Fetch rewards for each catalog item
        await fetchRewardsForItems(response.data?.data?.content)
      }
    } catch (err) {
      console.error("Error fetching catalog items:", err)
      toast.error(err.message || "Không thể tải danh sách thành phần")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRewardsForItems = async (catalogItems) => {
    try {
      const catalogItemIds = catalogItems.map(item => item.catalogItemId)

      if (catalogItemIds.length === 0) return

      const response = await rewardApi.getRewardContainingACatalogItem(campaignId, catalogItemIds)
      if (response?.data?.data) {

        setItemRewards(response?.data?.data)
      }
    } catch (err) {
      console.error("Error fetching rewards for items:", err)
    }
  }

  const handleCreate = () => {
    setEditingItem(null)
    setIsFormOpen(true)
  }

  const handleEdit = async (item) => {
    try {
      toast.loading('Đang tải chi tiết thành phần...', { id: 'fetch-item-detail' })

      // Fetch full details for editing
      const response = await catalogItemApi.getCatalogItemDetails(campaignId, item.catalogItemId)

      if (response?.data?.data) {
        const responseData = response.data.data
        const detailData = {
          catalogItemId: responseData.catalogItemId,
          name: responseData.name,
          description: responseData.description,
          price: responseData.price,
          imageUrl: responseData.imageUrl,
        }

        console.log('Setting editing item:', detailData)
        setEditingItem(detailData)
        setIsFormOpen(true)
        toast.success('Đã tải chi tiết thành phần', { id: 'fetch-item-detail' })
      } else {
        console.error('Invalid response structure:', response)
        toast.error('Không nhận được dữ liệu từ server', { id: 'fetch-item-detail' })
      }
    } catch (err) {
      console.error("Error fetching item details:", err)
      toast.error(err.message || "Không thể tải chi tiết thành phần", { id: 'fetch-item-detail' })
    }
  }

  const handleSave = async (item) => {
    // Clear previous errors
    setFieldErrors({})

    try {
      setIsLoading(true)

      // Prepare payload with exact API field names
      const payload = {
        name: item.name,
        description: item.description,
        price: item.price,
      }

      // Add imageUrl only if it exists
      if (item.imageUrl) {
        payload.imageUrl = item.imageUrl
      }

      const toastId = editingItem ? 'update-catalog-item' : 'create-catalog-item'
      const loadingMsg = editingItem ? 'Đang cập nhật thành phần...' : 'Đang tạo thành phần...'
      const successMsg = editingItem ? 'Cập nhật thành phần thành công!' : 'Tạo thành phần thành công!'

      toast.loading(loadingMsg, { id: toastId })

      let response
      if (editingItem && editingItem.catalogItemId) {
        // Update existing item
        response = await catalogItemApi.updateCatalogItem(
          campaignId,
          editingItem.catalogItemId,
          payload
        )

        if (response?.data?.data) {
          const responseData = response.data.data
          const updatedItem = {
            catalogItemId: responseData.catalogItemId,
            name: responseData.name,
            description: responseData.description,
            price: responseData.price,
            imageUrl: responseData.imageUrl,
          }

          // Update local state
          setItems(prevItems =>
            prevItems.map(item =>
              item.catalogItemId === updatedItem.catalogItemId ? updatedItem : item
            )
          )
          toast.success(successMsg, { id: toastId })
        } else {
          toast.error('Không nhận được phản hồi từ server', { id: toastId })
        }
      } else {
        // Create new item
        response = await catalogItemApi.createCatalogItem(campaignId, payload)

        if (response?.data?.data) {
          const responseData = response.data.data
          const newItem = {
            catalogItemId: responseData.catalogItemId,
            name: responseData.name,
            description: responseData.description,
            price: responseData.price,
            imageUrl: responseData.imageUrl,
          }

          // Add to local state
          setItems(prevItems => [...prevItems, newItem])
          toast.success(successMsg, { id: toastId })
        } else {
          toast.error('Không nhận được phản hồi từ server', { id: toastId })
        }
      }

      setIsFormOpen(false)
      setEditingItem(null)
    } catch (error) {
      const toastId = editingItem ? 'update-catalog-item' : 'create-catalog-item'

      // Handle backend validation errors
      if (error.errors && Array.isArray(error.errors)) {
        const errors = error.errors
        const newFieldErrors = {}

        // Map backend errors to field errors
        errors.forEach(err => {
          if (err.field) {
            newFieldErrors[err.field] = err.message
          }
        })

        setFieldErrors(newFieldErrors)

        const errorCount = errors.length
        toast.error(
          errorCount === 1
            ? errors[0].message
            : `Vui lòng kiểm tra lại thông tin`,
          { id: toastId }
        )
      } else if (error.response?.data?.message) {
        // Handle single message error from backend
        console.log('Backend message error:', error.response.data.message)
        toast.error(error.response.data.message, { id: toastId })
      } else if (error.message) {
        // Handle network or other errors
        console.log('Network/Other error:', error.message)
        toast.error(error.message, { id: toastId })
      } else {
        // Final fallback
        console.log('Unknown error format')
        toast.error('Đã xảy ra lỗi không xác định', { id: toastId })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingItem(null)
    setFieldErrors({})
  }

  const handleDelete = async (catalogItemId) => {
    try {
      setIsLoading(true)

      const toastId = 'delete-catalog-item'
      toast.loading('Đang xóa thành phần...', { id: toastId })

      await catalogItemApi.deleteCatalogItem(campaignId, catalogItemId)

      // ✅ Update UI immediately after successful delete
      setItems(prevItems =>
        prevItems.filter(item => item.catalogItemId !== catalogItemId)
      )

      toast.success('Xóa thành phần thành công!', { id: toastId })
    } catch (err) {
      console.error("Error deleting item:", err)
      toast.error(err.message || "Không thể xóa thành phần", { id: 'delete-catalog-item' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!isFormOpen ? (
        <ItemList
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
          isLoading={isLoading}
          itemRewards={itemRewards}
        />
      ) : (
        <ItemForm
          item={editingItem}
          onSave={handleSave}
          onCancel={handleCancel}
          campaignId={campaignId}
          isLoading={isLoading}
          fieldErrors={fieldErrors}
        />
      )}
    </div>
  )
}
