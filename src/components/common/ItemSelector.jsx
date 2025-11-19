import { useState, useMemo } from "react"
import Button from "./Button"
import Input from "./Input"
import { Check, Search } from "lucide-react"

export default function ItemSelector({ items, selectedItems, onConfirm, onClose, isAddOnMode = false }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [localSelected, setLocalSelected] = useState(selectedItems)

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const itemName = item.name || item.title || ''
      return itemName.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [items, searchTerm])

  const handleQtyChange = (itemId, qty) => {
    if (qty <= 0) {
      setLocalSelected((prev) => prev.filter((item) => item.catalogItemId !== itemId))
    } else {
      setLocalSelected((prev) => {
        const existing = prev.find((item) => item.catalogItemId === itemId)
        if (existing) {
          return prev.map((item) => (item.catalogItemId === itemId ? { ...item, quantity: qty } : item))
        } else {
          return [...prev, { catalogItemId: itemId, quantity: qty }]
        }
      })
    }
  }

  const handleToggleItem = (itemId) => {
    const existing = localSelected.find((item) => item.catalogItemId === itemId)
    if (existing) {
      // Remove item
      setLocalSelected((prev) => prev.filter((item) => item.catalogItemId !== itemId))
    } else {
      // Add item with default quantity = 1 (or 0 for add-on mode)
      const defaultQty = isAddOnMode ? 0 : 1
      setLocalSelected((prev) => [...prev, { catalogItemId: itemId, quantity: defaultQty }])
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
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 !m-0"
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Tìm kiếm thành phần..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-primary">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Không tìm thấy thành phần nào' : 'Chưa có thành phần nào. Vui lòng tạo component trước.'}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const itemId = item.catalogItemId || item.id
                const itemName = item.name || item.title
                const itemImage = item.imageUrl || item.image
                const selected = localSelected.find((s) => s.catalogItemId === itemId)
                const isSelected = !!selected

                return (
                  <div
                    key={itemId}
                    onClick={() => handleToggleItem(itemId)}
                    className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                      }`}
                  >
                    {/* Left side: Image + Title */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={itemName}
                          className="w-16 h-16 object-cover rounded flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-muted-foreground">No img</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{itemName}</p>
                        {item.price && (
                          <p className="text-sm text-muted-foreground">{item.price.toLocaleString()} VND</p>
                        )}
                      </div>
                    </div>

                    {/* Right side: Quantity input (if selected) + Check icon */}
                    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                      {isSelected && !isAddOnMode && (
                        <input
                          type="number"
                          value={selected.quantity}
                          onChange={(e) => {
                            e.stopPropagation()
                            const qty = Number.parseInt(e.target.value) || 1
                            handleQtyChange(itemId, qty)
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-16 text-center border border-border rounded px-2 py-1 bg-background text-foreground font-medium"
                          min="1"
                        />
                      )}

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
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
