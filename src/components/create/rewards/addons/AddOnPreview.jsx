export default function AddOnPreview({ addon, items }) {
  if (!addon) {
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

  const addonItems = addon.items
    .map((item) => ({
      ...item,
      title: items.find((i) => i.id === item.itemId)?.title,
    }))
    .filter((item) => item.title)

  return (
    <div className="sticky top-6 rounded-xl border border-border bg-card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Xem trước</h3>

      {addon.image && (
        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
          <img src={addon.image || "/placeholder.svg"} alt={addon.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div>
        <h4 className="font-semibold text-foreground line-clamp-2">{addon.title}</h4>
        <p className="text-2xl font-bold text-secondary mt-2">CA${addon.price}</p>
      </div>

      {addonItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase">Thành phần</p>
          {addonItems.map((item) => (
            <div key={item.itemId} className="text-sm text-foreground">
              • {item.title} × {item.qty}
            </div>
          ))}
        </div>
      )}

      {addon.offeredWithRewardIds?.length > 0 && (
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          ✓ Áp dụng cho {addon.offeredWithRewardIds.length} phần thưởng
        </div>
      )}

      {addon.limitTotal && (
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">⚠️ Giới hạn: {addon.limitTotal} suất</div>
      )}
    </div>
  )
}
