import Button from "@/components/common/Button"
import RewardCard from "../components/RewardCard"

export default function RewardList({
  rewards,
  items,
  onEdit,
  onDelete,
  onDuplicate,
  onCreate,
  isReadOnly = false,
  rewardRules = {},
}) {
  const preventDeletingOldRewards = Boolean(rewardRules?.preventDeletingOldRewards)
  if (rewards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 py-16 px-4">
        <div className="text-5xl mb-4">🎁</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Chưa có phần thưởng nào</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-sm">
          Tạo phần thưởng đầu tiên để backer có thể ủng hộ dự án của bạn
        </p>
        <Button
          onClick={onCreate}
          variant="primary"
          disabled={isReadOnly}
          className={isReadOnly ? "opacity-60 cursor-not-allowed" : ""}
        >
          + Tạo phần thưởng
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Phần thưởng ({rewards.length})</h2>
        <Button
          onClick={onCreate}
          variant="primary"
          size="md"
          disabled={isReadOnly}
          className={isReadOnly ? "opacity-60 cursor-not-allowed" : ""}
        >
          + Tạo mới
        </Button>
      </div>

      {/* Header */}
      <div className="hidden md:grid md:grid-cols-4 gap-6 px-6 py-3 text-sm font-medium text-muted-foreground bg-white dark:bg-darker-2 inset-shadow-2xs shadow-md rounded-sm">
        <div>Số tiền pledge</div>
        <div>Chi tiết</div>
        <div>Bao gồm</div>
        <div>Hình ảnh</div>
      </div>

      <div className="space-y-4">
        {rewards.map((reward) => {
          const deleteDisabled = preventDeletingOldRewards && reward?.isOld
          return (
          <RewardCard
            key={reward.rewardId}
            data={reward}
            items={items}
            type="reward"
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            isReadOnly={isReadOnly}
              disableDelete={deleteDisabled}
              deleteTooltip={deleteDisabled ? 'Không thể xóa phần thưởng đã tồn tại trong trạng thái này.' : undefined}
          />
          )
        })}
      </div>
    </div>
  )
}
