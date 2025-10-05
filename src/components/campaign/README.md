# Campaign Module - Trang Chi Tiết Chiến Dịch

Module hoàn chỉnh cho trang chi tiết chiến dịch gây quỹ với 4 tab: Campaign / Rewards / Creator / Leaderboard.

## 📁 Cấu trúc File

```
src/components/campaign/
├─ CampaignHeader.jsx          # Header với ảnh, thông tin, CTA (đã có)
├─ CampaignTabs.jsx            # Tabs điều hướng 4 mục
├─ CampaignPage.jsx            # Trang Campaign (layout 3 cột)
├─ rewards/
│  ├─ RewardsColumn.jsx        # Cột trái - danh sách rewards
│  ├─ RewardCard.jsx           # Card hiển thị từng reward
│  ├─ CreatorInfoCard.jsx      # Thông tin creator
│  └─ PledgeNoRewardCard.jsx   # Pledge without reward
└─ story/
   ├─ StoryWithMenu.jsx        # Story content với scroll spy
   ├─ TocMenu.jsx              # Table of Contents menu
   └─ BlankSection.jsx         # Render từng blank section
```

## 🎨 Features

### ✅ Đã Triển Khai

1. **CampaignTabs** - Thanh tab sticky với 4 mục

   - Tab active có underline màu primary
   - Hover effect trên các tab
   - Responsive trên mobile

2. **CampaignPage** - Layout 3 cột

   - Rewards (trái) - Creator info + Pledge options + Reward cards
   - Story (giữa) - Nội dung blanks với HTML render
   - TOC Menu (phải) - Table of contents với scroll spy

3. **RewardCard** - Card reward kiểu Kickstarter

   - Ảnh cover 3:2
   - Title & Price header
   - Meta info (Backers, Ships to, ETA)
   - Thumbnail gallery
   - Details & Pledge buttons

4. **Story Components**
   - BlankSection - Render HTML content an toàn
   - TocMenu - Menu dọc với active highlight
   - Scroll spy - Tự động highlight section đang xem

### 🚧 Placeholder (Coming Soon)

- Tab "Rewards" - Gallery view
- Tab "Creator" - Creator profile
- Tab "Leaderboard" - Top backers

## 📖 Cách Sử Dụng

### Import vào Page

```jsx
import CampaignHeader from '@/components/campaign/CampaignHeader';
import CampaignTabs from '@/components/campaign/CampaignTabs';

export default function CampaignDetailPage() {
  // Data
  const campaignData = { ... };
  const rewards = [ ... ];
  const creator = { ... };
  const blanks = [ ... ];

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-20">
      <CampaignHeader campaign={campaignData} />

      <CampaignTabs
        initialTab="campaign"
        campaignProps={{
          rewards,
          creator,
          blanks,
          currency: 'USD',
          onPledge: (data) => console.log(data),
        }}
      />
    </div>
  );
}
```

### Data Structure

#### Reward Object

```js
{
  id: 'reward-1',
  title: 'DiskPro 1TB [Kickstarter Price]',
  priceLabel: 'US$ 199',
  description: 'Multi-line description...',
  coverUrl: 'https://...',
  backers: 4,
  shipsTo: 'Only certain countries',
  eta: 'Dec 2025',
  itemsIncluded: 4,
  thumbnails: ['url1', 'url2'],
  addOnCount: 1,
  detailsHref: '#',
  pledgeActionLabel: 'Pledge US$ 199'
}
```

#### Creator Object

```js
{
  name: 'BEAVERLAB TECH',
  created: 5,
  backed: 9,
  avatarUrl: 'https://...',
  bio: 'Short bio...',
  moreHref: '#creator-profile'
}
```

#### Blank Object

```js
{
  id: 'blank-intro',
  order: 0,
  title_text: 'Our Commitments',
  title_html: '<span>Our Commitments</span>',
  content_html: '<p>HTML content...</p>'
}
```

## 🎯 Key Features

### 1. Responsive Layout

- Mobile: Cột dọc (Rewards → Story → Menu)
- Desktop: 3 cột song song
- Grid: `[360px_minmax(0,1fr)_260px]`

### 2. Scroll Spy

- Tự động highlight mục TOC khi scroll
- Smooth scroll khi click TOC
- IntersectionObserver với `rootMargin: "0px 0px -60% 0px"`

### 3. Sticky Elements

- Tabs sticky `top-[72px]`
- TOC menu sticky trong viewport
- Backdrop blur cho tabs

### 4. A11y

- ARIA roles cho tabs
- Alt text cho images
- Semantic HTML
- Keyboard navigation

## 🎨 Styling

Sử dụng tokens từ `index.css`:

- `bg-card`, `bg-background`, `bg-muted`
- `text-foreground`, `text-secondary`, `text-text-secondary`
- `border-border`
- `text-primary` cho hover/active

## 🔧 Customization

### Thay đổi số cột Rewards

```jsx
// Trong CampaignPage.jsx
className = 'grid ... lg:grid-cols-[420px_minmax(0,1fr)_260px]';
//                                 ^^^ Tăng width cột rewards
```

### Tùy chỉnh TOC position

```jsx
// Trong TocMenu.jsx
className = 'sticky top-[72px] ...';
//                      ^^^ Điều chỉnh offset
```

### Custom scroll spy sensitivity

```jsx
// Trong StoryWithMenu.jsx useScrollSpy
rootMargin: '0px 0px -60% 0px',  // Điều chỉnh %
threshold: 0.2,                   // 0-1
```

## 🚀 Next Steps

1. ✅ Tab Campaign - Hoàn thành
2. ⏳ Tab Rewards - Gallery với filter
3. ⏳ Tab Creator - Profile đầy đủ
4. ⏳ Tab Leaderboard - Top backers list
5. ⏳ Comments section
6. ⏳ Related campaigns

## 📝 Notes

- HTML trong `content_html` phải được sanitize ở backend
- Images lazy load với `loading="lazy"`
- YouTube embeds responsive với `aspect-video`
- Mobile menu ẩn cột TOC (hiện ở mobile bottom sheet nếu cần)
