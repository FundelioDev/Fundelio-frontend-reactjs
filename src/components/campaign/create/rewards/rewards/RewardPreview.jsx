export default function RewardPreview({ reward, items, rewards, type = 'reward' }) {
  const isAddon = type === 'addon'
  
  if (!reward) {
    return (
      <div className="sticky top-6 rounded-md border border-border shadow-md bg-white dark:bg-darker-2 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Xem trước</h3>
        <div className="space-y-4">
          <div className="aspect-video rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Chưa có ảnh</span>
          </div>
          <div className="space-y-2">
            <div>
              <h4 className="font-semibold text-foreground line-clamp-2">Tiêu đề</h4>
              <p className="text-2xl font-bold text-primary mt-2">0 VND</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Người ủng hộ</p>
              <p className="text-lg font-semibold text-foreground">0</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Giao dự kiến</p>
              <p className="text-lg font-semibold text-foreground">
                Tháng/Năm
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-6 rounded-sm border border-border bg-white dark:bg-darker-2 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Xem trước</h3>

      {reward.imageUrl && (
        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
          <img src={reward.imageUrl || "/placeholder.svg"} alt={reward.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div>
        <h4 className="font-semibold text-foreground line-clamp-2">{reward.title}</h4>
        <p className={`text-2xl font-bold mt-2 flex items-center gap-2 ${isAddon ? 'text-secondary' : 'text-primary'}`}>
          {reward.minPledgedAmount || 0}
          <span className="text-sm">VND</span>
        </p>
      </div>

      {reward?.items?.included.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase">Thành phần</p>
          {reward?.items?.included.map((item) => (
            <div key={item.catalogItemId} className="text-sm text-foreground">
              • {item.name} × {item.bundleQuantity}
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
            Tháng {reward.delivery?.month} {reward.delivery?.year}
          </p>
        </div>
      </div>

      {!isAddon && reward.shipping === "anywhere" && (
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">✓ Ship toàn cầu</div>
      )}
    </div>
  )
}
