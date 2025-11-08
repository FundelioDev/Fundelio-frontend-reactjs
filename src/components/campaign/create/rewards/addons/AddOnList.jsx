import Button from "@/components/common/Button"
import RewardCard from "../components/RewardCard"

export default function AddOnList({ addOns, items, rewards, onEdit, onDelete, onCreate }) {
  if (addOns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 py-16 px-4">
        <div className="text-5xl mb-4">➕</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Chưa có add-on nào</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-sm">
          Tạo add-on để cho phép backer thêm các mục bổ sung vào phần thưởng của họ
        </p>
        <Button onClick={onCreate} variant="primary">
          + Tạo add-on
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Add-ons ({addOns.length})</h2>
        <Button onClick={onCreate} variant="primary" size="md">
          + Tạo mới
        </Button>
      </div>

      {/* Header - 4 columns for addons */}
      <div className="hidden md:grid md:grid-cols-4 gap-6 px-6 py-3 text-sm font-medium text-muted-foreground bg-white dark:bg-darker-2 rounded-sm inset-shadow-2xs shadow-md">
        <div>Số tiền</div>
        <div>Chi tiết</div>
        <div>Bao gồm</div>
        <div>Hình ảnh</div>
      </div>

      <div className="space-y-4">
        {addOns.map((addon) => (
          <RewardCard
            key={addon.id}
            data={addon}
            items={items}
            rewards={rewards}
            type="addon"
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
