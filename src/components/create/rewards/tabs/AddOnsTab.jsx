import { useState } from "react"
import AddOnList from "../addons/AddOnList"
import AddOnForm from "../addons/AddOnForm"
import AddOnPreview from "../addons/AddOnPreview"

export default function AddOnsTab({ state, dispatch }) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAddOn, setEditingAddOn] = useState(null)
  const [previewAddOn, setPreviewAddOn] = useState(null)

  const handleCreate = () => {
    setEditingAddOn(null)
    setIsFormOpen(true)
  }

  const handleEdit = (addon) => {
    setEditingAddOn(addon)
    setIsFormOpen(true)
  }

  const handleSave = (addon) => {
    if (editingAddOn) {
      dispatch({ type: "UPDATE_ADDON", payload: addon })
    } else {
      dispatch({ type: "ADD_ADDON", payload: addon })
    }
    setIsFormOpen(false)
    setEditingAddOn(null)
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingAddOn(null)
  }

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa add-on này?")) {
      dispatch({ type: "DELETE_ADDON", payload: id })
    }
  }

  const handleFormChange = (addon) => {
    setPreviewAddOn(addon)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {!isFormOpen ? (
          <AddOnList
            addOns={state.addOns}
            items={state.items}
            rewards={state.rewards}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
          />
        ) : (
          <AddOnForm
            addon={editingAddOn}
            items={state.items}
            rewards={state.rewards}
            onSave={handleSave}
            onCancel={handleCancel}
            onChange={handleFormChange}
          />
        )}
      </div>

      <div className="lg:col-span-1">
        <AddOnPreview addon={previewAddOn || editingAddOn} items={state.items} />
      </div>
    </div>
  )
}
