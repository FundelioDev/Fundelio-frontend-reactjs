import { useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { addReward, updateReward, deleteReward, duplicateReward } from "@/store/campaignSlice"
import RewardList from "../rewards/RewardList"
import RewardForm from "../rewards/RewardForm"
import RewardPreview from "../rewards/RewardPreview"

export default function RewardTiersTab({ state }) {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingReward, setEditingReward] = useState(null)
  const [previewReward, setPreviewReward] = useState(null)
  const formRef = useRef(null)

  const handleCreate = () => {
    setEditingReward(null)
    setPreviewReward(null)
    setIsFormOpen(true)
  }

  const handleEdit = (reward) => {
    setEditingReward(reward)
    setPreviewReward(null)
    setIsFormOpen(true)
  }

  const handleSave = (reward) => {
    if (editingReward) {
      dispatch(updateReward(reward))
    } else {
      dispatch(addReward(reward))
    }
    setIsFormOpen(false)
    setEditingReward(null)
    setPreviewReward(null)
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingReward(null)
    setPreviewReward(null)
  }

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa phần thưởng này?")) {
      dispatch(deleteReward(id))
    }
  }

  const handleDuplicate = (id) => {
    dispatch(duplicateReward(id))
  }

  // Update preview when form changes
  const handleFormChange = (reward) => {
    setPreviewReward(reward)
  }

  return (
    <div>
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
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form Column */}
          <div className="flex-1">
            <RewardForm
              ref={formRef}
              reward={editingReward}
              items={state.items}
              rewards={state.rewards}
              onSave={handleSave}
              onCancel={handleCancel}
              onChange={handleFormChange}
            />
          </div>

          {/* Preview Column */}
          <div className="lg:w-96">
            <RewardPreview reward={previewReward || editingReward} items={state.items} />
          </div>
        </div>
      )}
    </div>
  )
}
