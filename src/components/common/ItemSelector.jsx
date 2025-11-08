import { useState, useMemo } from "react"
import Button from "./Button"
import Input from "./Input"

export default function ItemSelector({ items, selectedItems, onConfirm, onClose }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [localSelected, setLocalSelected] = useState(selectedItems)

  const filteredItems = useMemo(() => {
    return items.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [items, searchTerm])

  const handleQtyChange = (itemId, qty) => {
    if (qty <= 0) {
      setLocalSelected((prev) => prev.filter((item) => item.itemId !== itemId))
    } else {
      setLocalSelected((prev) => {
        const existing = prev.find((item) => item.itemId === itemId)
        if (existing) {
          return prev.map((item) => (item.itemId === itemId ? { ...item, qty } : item))
        } else {
          return [...prev, { itemId, qty }]
        }
      })
    }
  }

  const handleConfirm = () => {
    onConfirm(localSelected)
  }

  const handleOverlayClick = (e) => {
    // Only close if clicking directly on the overlay, not its children
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-darker-2 rounded-lg shadow-2xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-foreground">Chọn thành phần</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-3xl leading-none transition-colors"
            type="button"
          >
            ×
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-border">
          <Input
            type="text"
            placeholder="Tìm kiếm thành phần..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Không tìm thấy thành phần nào' : 'Chưa có thành phần nào. Vui lòng tạo component trước.'}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const selected = localSelected.find((s) => s.itemId === item.id)
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{item.title}</p>
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="mt-2 w-16 h-16 object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.id, (selected?.qty || 0) - 1)}
                        className="w-8 h-8 flex items-center justify-center text-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={selected?.qty || 0}
                        onChange={(e) => handleQtyChange(item.id, Number.parseInt(e.target.value) || 0)}
                        className="w-16 text-center border border-border rounded px-2 py-1 bg-background text-foreground font-medium"
                        min="0"
                      />
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.id, (selected?.qty || 0) + 1)}
                        className="w-8 h-8 flex items-center justify-center text-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 p-6 border-t border-border">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            variant="gradient"
            className="flex-1"
          >
            Xác nhận ({localSelected.length})
          </Button>
        </div>
      </div>
    </div>
  )
}
