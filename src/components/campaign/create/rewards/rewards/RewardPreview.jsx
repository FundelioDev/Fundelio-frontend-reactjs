import { useMemo } from 'react'

export default function RewardPreview({ reward, items, rewards, type = 'reward' }) {
  const isAddon = type === 'addon'
  console.log('RewardPreview - reward:', reward)

  const formatDeliveryDate = (dateValue) => {
    if (!dateValue) return 'Ngày/Tháng/Năm'
    try {
      const date = new Date(dateValue)
      if (isNaN(date.getTime())) return 'Ngày/Tháng/Năm'
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    } catch (error) {
      return 'Ngày/Tháng/Năm'
    }
  }

  const minPledgeAmount = useMemo(() => {
    const includedItems = reward?.items?.included || []
    if (includedItems.length === 0) return 0

    return includedItems.reduce((total, item) => {
      return total + (item.price || 0) * (item.quantity || 1)
    }, 0)
  }, [reward?.items?.included])

  if (!reward) {
    return (
      <div className="sticky top-21 rounded-md border border-border shadow-md bg-white dark:bg-darker-2 p-6 space-y-4">
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
                {formatDeliveryDate(null)}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-21 rounded-sm shadow-card dark:shadow- bg-white dark:bg-darker-2 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Xem trước</h3>

      <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
        {reward.imageUrl ? (
          <img
            src={reward.imageUrl}
            alt={reward.title || 'Ảnh phần thưởng'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full border-2 border-dashed border-border bg-muted/30 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Chưa có ảnh</span>
          </div>
        )}
      </div>

      <div>
        <h4 className="font-semibold text-foreground line-clamp-2">{reward.title}</h4>
        <p className={`text-2xl font-bold mt-2 flex items-center gap-2 ${isAddon ? 'text-secondary' : 'text-primary'}`}>
          {minPledgeAmount || 0}
          <span className="text-sm">VND</span>
        </p>
      </div>

      {reward?.items?.included.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase">Thành phần</p>
          {reward?.items?.included.map((item) => (
            <div key={item.catalogItemId} className="text-sm text-foreground">
              • {item.name} × {item.quantity || 1}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">Giao dự kiến</p>
          <p className="text-lg font-semibold text-foreground">
            {formatDeliveryDate(reward.estimatedDelivery)}
          </p>
        </div>
      </div>

      {!isAddon && reward.shipping === "anywhere" && (
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">✓ Ship toàn cầu</div>
      )}
    </div>
  )
}
