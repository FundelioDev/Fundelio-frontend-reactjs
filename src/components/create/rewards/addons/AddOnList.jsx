import Button from "../ui/button"

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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Add-ons ({addOns.length})</h2>
        <Button onClick={onCreate} variant="primary" size="sm">
          + Tạo mới
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Tên</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Giá</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Thành phần</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Áp dụng cho</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {addOns.map((addon) => (
              <tr key={addon.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 text-foreground font-medium">{addon.title}</td>
                <td className="px-4 py-3 text-foreground">CA${addon.price}</td>
                <td className="px-4 py-3 text-muted-foreground">{addon.items.length} mục</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {addon.offeredWithRewardIds?.length || 0} phần thưởng
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onEdit(addon)}
                      className="px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(addon.id)}
                      className="px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 rounded transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
