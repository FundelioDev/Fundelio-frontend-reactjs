import { useState, useMemo } from "react"
import Button from "@/components/common/Button"
import Input from "@/components/common/Input"
import RewardCard from "./RewardCard"
import { Search } from "lucide-react"

export default function ItemList({
  items,
  onEdit,
  onDelete,
  onCreate,
  isLoading,
  itemRewards = {},
  isReadOnly = false,
  itemRules = {},
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const preventDeletingOldItems = Boolean(itemRules?.preventDeletingOldItems)

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [items, searchTerm])

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 py-16 px-4">
        <div className="text-5xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">Chưa có thành phần nào</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-sm">
          Tạo thành phần đầu tiên để bắt đầu xây dựng các phần thưởng của bạn
        </p>
        <Button
          onClick={onCreate}
          variant="primary"
          disabled={isReadOnly}
          className={isReadOnly ? "opacity-60 cursor-not-allowed" : ""}
        >
          + Tạo thành phần
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-muted-foreground">Thành phần ({items.length})</h2>
        <Button
          onClick={onCreate}
          variant="primary"
          size="md"
          disabled={isReadOnly}
          className={isReadOnly ? "opacity-60 cursor-not-allowed" : ""}
        >
          + Tạo mới
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 lg:top-5.5 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Tìm kiếm thành phần..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-sm shadow-sm pl-10"
        />
      </div>

      {/* Header - 3 columns for components */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 px-6 py-3 text-sm font-medium text-muted-foreground bg-white dark:bg-darker-2 rounded-sm inset-shadow-2xs shadow-md mb-4">
        <div>Tên thành phần</div>
        <div>Chi tiết</div>
        <div>Hình ảnh</div>
      </div>

      <div className="space-y-4">
        {filteredItems.map((item) => {
          const deleteDisabled = preventDeletingOldItems && item?.isOld
          return (
          <RewardCard
            key={item.catalogItemId}
            data={item}
            type="item"
            onEdit={onEdit}
            onDelete={onDelete}
            linkedRewards={itemRewards[item.catalogItemId] || []}
            isReadOnly={isReadOnly}
              disableDelete={deleteDisabled}
              deleteTooltip={deleteDisabled ? 'Không thể xóa thành phần đã tồn tại trong trạng thái này.' : undefined}
          />
          )
        })}
      </div>
    </div>
  )
}
