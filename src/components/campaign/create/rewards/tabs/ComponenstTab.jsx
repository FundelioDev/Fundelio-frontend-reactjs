"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { addItem, updateItem, deleteItem } from "@/store/campaignSlice"
import ItemList from "../components/ComponentList"
import ItemForm from "../components/ComponentForm"

export default function ComponentsTab({ state }) {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const handleCreate = () => {
    setEditingItem(null)
    setIsFormOpen(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setIsFormOpen(true)
  }

  const handleSave = (item) => {
    if (editingItem) {
      dispatch(updateItem(item))
    } else {
      dispatch(addItem(item))
    }
    setIsFormOpen(false)
    setEditingItem(null)
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingItem(null)
  }

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa thành phần này?")) {
      dispatch(deleteItem(id))
    }
  }

  return (
    <div className="space-y-6">
      {!isFormOpen ? (
        <ItemList items={state.items} onEdit={handleEdit} onDelete={handleDelete} onCreate={handleCreate} />
      ) : (
        <ItemForm item={editingItem} rewards={state.rewards} onSave={handleSave} onCancel={handleCancel} />
      )}
    </div>
  )
}
