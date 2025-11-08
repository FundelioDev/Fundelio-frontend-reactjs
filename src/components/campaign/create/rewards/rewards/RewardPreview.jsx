export default function RewardPreview({ reward, items, rewards, type = 'reward' }) {
  const isAddon = type === 'addon'
  
  if (!reward) {
    return (
      <div className="sticky top-6 rounded-xl border border-border bg-white dark:bg-darker-2 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Xem trước</h3>
        <div className="space-y-4">
          <div className="aspect-video rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Chưa có ảnh</span>
          </div>
          <div className="space-y-2">
            <div>
              <h4 className="font-semibold text-foreground line-clamp-2">Title</h4>
              <p className="text-2xl font-bold text-primary mt-2">$0</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Backers</p>
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

  const rewardItems = reward.items
    ?.map((item) => ({
      ...item,
      title: items.find((i) => i.id === item.itemId)?.title,
    }))
    .filter((item) => item.title) || []

  const applicableRewards = isAddon && reward.offeredWithRewardIds && rewards
    ? reward.offeredWithRewardIds
        .map((rewardId) => rewards.find((r) => r.id === rewardId)?.title)
        .filter(Boolean)
    : []

  return (
    <div className="sticky top-6 rounded-xl border border-border bg-white dark:bg-darker-2 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Xem trước</h3>

      {reward.image && (
        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
          <img src={reward.image || "/placeholder.svg"} alt={reward.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div>
        <h4 className="font-semibold text-foreground line-clamp-2">{reward.title}</h4>
        <p className={`text-2xl font-bold mt-2 flex items-center gap-2 ${isAddon ? 'text-secondary' : 'text-primary'}`}>
          {reward.price}
          <span className="text-sm">VND</span>
        </p>
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
            Tháng {reward.delivery?.month} {reward.delivery?.year}
          </p>
        </div>
      </div>

      {!isAddon && reward.shipping === "anywhere" && (
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">✓ Ship toàn cầu</div>
      )}

      {isAddon && applicableRewards.length > 0 && (
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          ✓ Áp dụng cho {applicableRewards.length} phần thưởng
        </div>
      )}

      {reward.limitTotal && (
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          ⚠️ Giới hạn: {reward.limitTotal} suất
        </div>
      )}
    </div>
  )
}
