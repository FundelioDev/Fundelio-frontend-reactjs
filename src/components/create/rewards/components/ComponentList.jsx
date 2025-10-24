import { useState, useMemo } from "react"
import Button from "../ui/button"
import Input from "../ui/input"

export default function ItemList({ items, onEdit, onDelete, onCreate }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredItems = useMemo(() => {
    return items.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [items, searchTerm])

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 py-16 px-4">
        <div className="text-5xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Chưa có thành phần nào</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-sm">
          Tạo thành phần đầu tiên để bắt đầu xây dựng các phần thưởng của bạn
        </p>
        <Button onClick={onCreate} variant="primary">
          + Tạo thành phần
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Thành phần ({items.length})</h2>
        <Button onClick={onCreate} variant="primary" size="sm">
          + Tạo mới
        </Button>
      </div>

      <Input
        type="text"
        placeholder="Tìm kiếm thành phần..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow"
          >
            <div className="mb-3 aspect-video rounded-lg bg-muted overflow-hidden">
              {item.image ? (
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span className="text-3xl">📷</span>
                </div>
              )}
            </div>
            <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">Thuộc {item.rewardRefs?.length || 0} phần thưởng</p>
            <div className="flex gap-2">
              <Button onClick={() => onEdit(item)} variant="secondary" size="sm" className="flex-1">
                Sửa
              </Button>
              <Button onClick={() => onDelete(item.id)} variant="destructive" size="sm" className="flex-1">
                Xóa
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
