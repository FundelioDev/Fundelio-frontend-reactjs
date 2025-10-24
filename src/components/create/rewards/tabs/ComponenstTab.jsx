"use client"

import { useState } from "react"
import ItemList from "../components/ComponentList"
import ItemForm from "../components/ComponentForm"

export default function ComponentsTab({ state, dispatch }) {
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
      dispatch({ type: "UPDATE_ITEM", payload: item })
    } else {
      dispatch({ type: "ADD_ITEM", payload: item })
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
      dispatch({ type: "DELETE_ITEM", payload: id })
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
