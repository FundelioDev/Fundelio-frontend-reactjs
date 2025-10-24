export default function RewardPreview({ reward, items }) {
  if (!reward) {
    return (
      <div className="sticky top-6 rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Xem trước</h3>
        <div className="space-y-4">
          <div className="aspect-video rounded-lg bg-muted animate-pulse" />
          <div className="h-6 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 bg-muted rounded animate-pulse" />
            <div className="h-12 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  const rewardItems = reward.items
    .map((item) => ({
      ...item,
      title: items.find((i) => i.id === item.itemId)?.title,
    }))
    .filter((item) => item.title)

  return (
    <div className="sticky top-6 rounded-xl border border-border bg-card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Xem trước</h3>

      {reward.image && (
        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
          <img src={reward.image || "/placeholder.svg"} alt={reward.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div>
        <h4 className="font-semibold text-foreground line-clamp-2">{reward.title}</h4>
        <p className="text-2xl font-bold text-primary mt-2">CA${reward.price}</p>
      </div>

      {rewardItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase">Thành phần</p>
          {rewardItems.map((item) => (
            <div key={item.itemId} className="text-sm text-foreground">
              • {item.title} × {item.qty}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">Backers</p>
          <p className="text-lg font-semibold text-foreground">0</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Giao dự kiến</p>
          <p className="text-lg font-semibold text-foreground">
            Tháng {reward.delivery.month} {reward.delivery.year}
          </p>
        </div>
      </div>

      {reward.shipping === "anywhere" && (
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">✓ Ship toàn cầu</div>
      )}

      {reward.limitTotal && (
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          ⚠️ Giới hạn: {reward.limitTotal} suất
        </div>
      )}
    </div>
  )
}
