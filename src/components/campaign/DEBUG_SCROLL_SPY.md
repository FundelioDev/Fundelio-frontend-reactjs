# Scroll Spy Debug - TOC Active State

## 🐛 Vấn đề

Menu TOC không highlight item khi scroll đến section tương ứng.

## 🔍 Nguyên nhân

**Trước đây:**

```jsx
// CampaignPage.jsx
<StoryWithMenu blanks={blanks} />           // Tính activeId ở đây
<TocMenu blanks={blanks} />                 // Không nhận được activeId ❌
```

- `StoryWithMenu` có hook `useScrollSpy` tính toán `activeId`
- Nhưng `activeId` **KHÔNG** được share với `TocMenu`
- `TocMenu` render riêng biệt, không biết section nào đang active
- Kết quả: Menu không bao giờ highlight

## ✅ Giải pháp

**Di chuyển scroll spy logic lên CampaignPage:**

```jsx
// CampaignPage.jsx
const CampaignPage = ({ blanks, ... }) => {
  // 1. Sort blanks và tạo section IDs
  const sortedBlanks = [...blanks].sort((a, b) => a.order - b.order);
  const sectionIds = sortedBlanks.map((b) => b.id);

  // 2. Tính activeId ở parent level
  const activeId = useScrollSpy(sectionIds);

  return (
    <div>
      {/* 3. Pass activeId xuống TocMenu */}
      <StoryWithMenu blanks={sortedBlanks} />
      <TocMenu blanks={sortedBlanks} activeId={activeId} /> ✅
    </div>
  );
};
```

## 📊 Debug Logs

Khi chạy, bạn sẽ thấy các logs sau trong console:

### 1. Khởi tạo

```
👀 Observing sections: ['blank-intro', 'blank-video', 'blank-features']
✅ Observing: blank-intro
✅ Observing: blank-video
✅ Observing: blank-features
```

### 2. Khi scroll

```
📍 Scroll Spy Active: blank-intro
🔍 CampaignPage State: {
  totalBlanks: 3,
  activeId: 'blank-intro'
}
📋 TocMenu received: {
  blanksCount: 3,
  activeId: 'blank-intro',
  blankIds: ['blank-intro', 'blank-video', 'blank-features']
}
```

### 3. Khi scroll tiếp

```
📍 Scroll Spy Active: blank-video
🔍 CampaignPage State: {
  totalBlanks: 3,
  activeId: 'blank-video'
}
📋 TocMenu received: {
  blanksCount: 3,
  activeId: 'blank-video',
  blankIds: ['blank-intro', 'blank-video', 'blank-features']
}
```

## 🎯 Kiểm tra

### ✅ Nếu hoạt động đúng:

- Console log hiện activeId thay đổi khi scroll
- TocMenu nhận được activeId mới
- Item trong menu có class `text-foreground font-semibold bg-muted`
- Thanh indicator xanh xuất hiện bên trái item active

### ❌ Nếu vẫn lỗi:

#### 1. Không thấy log "Observing sections"?

→ `blanks` array rỗng hoặc không có `id`

#### 2. Thấy log "Element not found"?

→ `BlankSection` không render với đúng `id` attribute

#### 3. activeId luôn rỗng?

→ IntersectionObserver không trigger, kiểm tra:

- Sections có đủ nội dung để trigger không?
- `rootMargin` và `threshold` có phù hợp không?

#### 4. TocMenu không nhận được activeId?

→ Kiểm tra props có được pass đúng không:

```jsx
<TocMenu blanks={sortedBlanks} activeId={activeId} />
```

## 📝 Code Flow

```
User Scrolls
     ↓
IntersectionObserver detects section
     ↓
useScrollSpy sets activeId
     ↓
CampaignPage re-renders
     ↓
activeId passed to TocMenu
     ↓
TocMenu highlights active item
     ↓
Visual feedback ✨
```

## 🔧 IntersectionObserver Config

```js
{
  rootMargin: '0px 0px -60% 0px',  // Bottom 60% = trigger zone
  threshold: 0.2,                   // 20% visible
}
```

**Giải thích:**

- `rootMargin: '0px 0px -60% 0px'` - Chỉ tính section ở 40% trên cùng của viewport
- `threshold: 0.2` - Section phải hiện ít nhất 20% mới trigger

**Điều chỉnh:**

- Muốn trigger sớm hơn → giảm `-60%` → `-40%`
- Muốn trigger muộn hơn → tăng `threshold: 0.5`

## 🎨 Visual State

```jsx
{
  blanks.map((blank) => {
    const isActive = activeId === blank.id; // ← So sánh ở đây

    return (
      <button
        className={`
        ${
          isActive
            ? 'text-foreground font-semibold bg-muted' // ← Active style
            : 'text-text-secondary' // ← Default style
        }
      `}
      >
        {/* Active indicator */}
        {isActive && (
          <span className="w-1 h-4 bg-primary" /> // ← Blue bar
        )}
        {blank.title_text}
      </button>
    );
  });
}
```

## 🚀 Performance

- IntersectionObserver là native browser API → Rất nhanh
- Chỉ observe khi component mount
- Cleanup khi unmount
- Không có scroll event listener → Không lag

## 📚 Tham khảo

- [MDN: IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [React: Lifting State Up](https://react.dev/learn/sharing-state-between-components)
