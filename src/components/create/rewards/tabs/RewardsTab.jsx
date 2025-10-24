import { useState } from "react"
import RewardList from "../rewards/RewardList"
import RewardForm from "../rewards/RewardForm"
import RewardPreview from "../rewards/RewardPreview"

export default function RewardTiersTab({ state, dispatch }) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingReward, setEditingReward] = useState(null)
  const [previewReward, setPreviewReward] = useState(null)

  const handleCreate = () => {
    setEditingReward(null)
    setIsFormOpen(true)
  }

  const handleEdit = (reward) => {
    setEditingReward(reward)
    setIsFormOpen(true)
  }

  const handleSave = (reward) => {
    if (editingReward) {
      dispatch({ type: "UPDATE_REWARD", payload: reward })
    } else {
      dispatch({ type: "ADD_REWARD", payload: reward })
    }
    setIsFormOpen(false)
    setEditingReward(null)
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingReward(null)
  }

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa phần thưởng này?")) {
      dispatch({ type: "DELETE_REWARD", payload: id })
    }
  }

  const handleDuplicate = (id) => {
    dispatch({ type: "DUPLICATE_REWARD", payload: id })
  }

  // Update preview when form changes
  const handleFormChange = (reward) => {
    setPreviewReward(reward)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {!isFormOpen ? (
          <RewardList
            rewards={state.rewards}
            items={state.items}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onCreate={handleCreate}
          />
        ) : (
          <RewardForm
            reward={editingReward}
            items={state.items}
            rewards={state.rewards}
            onSave={handleSave}
            onCancel={handleCancel}
            onChange={handleFormChange}
          />
        )}
      </div>

      <div className="lg:col-span-1">
        <RewardPreview reward={previewReward || editingReward} items={state.items} />
      </div>
    </div>
  )
}
