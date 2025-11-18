# Fundelio Dashboard Spec (Founder View)

## 1. Mục tiêu

Là Founder, mình muốn một dashboard giúp:

- Nhìn nhanh **sức khỏe tổng thể** của toàn bộ chiến dịch.
- Biết **tiền về, tốc độ tăng trưởng, tỉ lệ đạt mục tiêu** theo thời gian.
- Theo dõi **hành vi backer** (quyên góp lúc nào, gói nào, kênh nào).
- So sánh **hiệu suất giữa các chiến dịch** để tối ưu.
- Đào sâu xuống **dashboard chi tiết của từng chiến dịch** khi cần.

> Lưu ý: Tài liệu này là product spec ở mức _Founder-facing_ (không lock chặt theo API hiện tại, mà định hướng để backend có thể bổ sung field/endpoint nếu thiếu).

---

## 2. Dashboard tổng cho toàn bộ chiến dịch (Founder Overview)

### 2.1. Các entity & field liên quan

Dựa trên code hiện tại (`campaignApi`, `pledgeApi`, `rewardApi`, `campaignSlice`, `CampaignHeader`, `RewardsColumn`, ...), ta có các entity chính:

- **User / Founder**

  - `id`
  - `name`
  - `email`

- **Campaign**

  - `id`
  - `title`
  - `description`
  - `goalAmount`
  - `currency`
  - `campaignCategory`
  - `startDate` / `endDate` hoặc `startTime` / `endTime`
  - `campaignStatus` (`DRAFT`, `PENDING`, `ACTIVE`, `ENDED`, `CANCELLED`, ...)
  - `owner.userId`

- **Pledge / Backer**

  - `id`
  - `campaignId`
  - `userId`
  - `rewardId` (có thể null nếu pledge không reward)
  - `amount`
  - `currency`
  - `createdAt`
  - meta: `paymentStatus`, `paymentMethod`, `source` (web, mobile, referral,... nếu thêm về sau)

- **Reward**
  - `id`
  - `campaignId`
  - `title`
  - `description`
  - `minPledgedAmount`
  - `estimatedDelivery`
  - `items.included[]`, `items.addOn[]`
  - `limitTotal`, `limitPerBacker`

Trên nền đó, dashboard Founder nên tổng hợp các field/kpi sau.

### 2.2. Khu vực 1 – Global KPI (trên cùng)

**Mục tiêu:** Trong 5s đầu tiên, Founder nắm được tình hình tổng thể.

**KPI đề xuất:**

1. **Total Raised (Lifetime)**

   - Field: `sum(pledge.amount)` trên tất cả campaign thuộc founder.
   - Optional filter: theo currency hoặc convert về 1 currency chuẩn.

2. **Total Backers (Unique)**

   - Field: `countDistinct(pledge.userId)`.

3. **Active Campaigns**

   - Field: `count(campaign where status = ACTIVE)`.

4. **Success Rate**

   - Field: `count(campaign where pledged >= goalAmount) / count(campaign ended)`.

5. **Monthly Raised (This Month)**
   - Field: `sum(pledge.amount where createdAt in current_month)`.

**UI gợi ý:**

- 4–5 **stat cards** (giống `admin/dashboard/StatCard.jsx` style) nằm ngang.
- Mỗi card có:
  - Icon (tiền, user, rocket, check-circle,...)
  - Value lớn, subtitle nhỏ.
  - % change vs. previous period (nếu có dữ liệu): `+18% vs last month`.

**Biểu đồ phù hợp:**

- Không cần biểu đồ ở khu vực này, chỉ stat card. Hover có thể show tooltip chi tiết.

### 2.3. Khu vực 2 – Revenue & Backers theo thời gian

**Câu hỏi Founder:**

- Trong 6 tháng gần nhất tiền về thế nào?
- Backer có đang tăng hay chững lại?

**Field/KPI:**

- `sum(pledge.amount)` group theo ngày/tuần/tháng.
- `count(pledge.id)` group theo ngày/tuần/tháng.
- Filter theo:
  - Thời gian: `Last 7 days`, `Last 30 days`, `This quarter`, `Custom range`.
  - Campaign: All / chọn 1 hoặc nhiều campaign.

**Biểu đồ:**

- **Line chart (dual-axis)**:
  - trục X: thời gian.
  - trục Y1: tổng tiền raised.
  - trục Y2: số pledges/backers.
- Hoặc tách thành 2 line chart stacked vertically nếu muốn đơn giản.

**UI:**

- Card titled "Revenue & Backers Over Time".
- Toolbar nhỏ gồm:
  - Dropdown Time range.
  - Multi-select Campaign.

### 2.4. Khu vực 3 – Top Campaigns (Leaderboards)

**Câu hỏi Founder:**

- Chiến dịch nào đang perform tốt nhất?
- Campaign nào cần quan tâm vì hiệu suất thấp?

**Field/KPI mỗi campaign:**

- `campaign.title`
- `campaign.campaignCategory`
- `campaignStatus`
- `totalRaised` (sum pledge.amount)
- `goalAmount`
- `progressPercent = totalRaised / goalAmount`
- `backersCount = countDistinct(pledge.userId)`
- `daysLeft = endDate - today`
- `conversionRate` (optional, nếu track view): `backers / campaignViews`.

**View 1 – Bảng Top Campaigns:**

- Bảng sortable với các cột:
  - Name
  - Category
  - Status
  - Raised
  - Goal
  - Progress (%) – progress bar small.
  - Backers
  - Days Left
- Sortable theo:
  - `Raised desc`
  - `Backers desc`
  - `Progress desc`
  - `Days Left asc`.
- Row click => drill down sang **Campaign Dashboard** chi tiết.

**View 2 – Bar Chart:**

- **Horizontal bar chart** top 5–10 campaigns theo `totalRaised`.
- Mỗi bar hiển thị label: `title` + `% funded`.

### 2.5. Khu vực 4 – Funnel / Hành vi Backer (tuỳ mức tracking)

Nếu sau này có thêm tracking view/visit, ta có thể có funnel:

- Impressions -> Page Views -> Pledge Count -> Backers -> Repeat Backers.

Hiện tại code base chưa thể hiện rõ tracking này, nên spec ở mức đề xuất:

**Field (đề xuất thêm):**

- `campaignViews`
- `uniqueVisitors`
- `referralSource` (direct, social, email, partner, ...)

**KPI:**

- `View-to-Pledge Conversion` = pledgeCount / campaignViews.
- `Repeat Backers` = count(userId đóng góp >= 2 lần).
- `Top Sources by Revenue`.

**Biểu đồ:**

- **Funnel chart** cho một chiến dịch hoặc toàn bộ.
- **Donut/Pie chart**: phân bổ revenue theo `referralSource`.

### 2.6. Khu vực 5 – Recent Activity / Live Feed

**Câu hỏi Founder:**

- Ai vừa pledge? Pledge vào campaign nào? Gói nào?

**Field:**

- Từ `pledgeApi.getMyPledges` kết hợp campaign & reward:
  - `pledge.createdAt`
  - `pledge.amount`
  - `campaign.title`
  - `reward.title` (nếu có)
  - `user.name` (ẩn/anonymized nếu cần).

**UI:**

- List dạng timeline:
  - "[10:32] Nguyen A pledged $50 to ‘Odin 3’ – Reward: Early Bird"
- Có filter nhỏ: `Last 24h`, `Last 7 days`.

**Biểu đồ:**

- Chủ yếu là list/timeline, không cần chart.

---

## 3. Dashboard chi tiết cho 1 chiến dịch (Campaign Dashboard)

Khi Founder click vào một campaign trong overview, đi vào dashboard riêng của campaign đó.

### 3.1. Header – Campaign Snapshot

**Field sử dụng** (nhiều field đã có trong `CampaignHeader.jsx`):

- `title`
- `imageUrl`
- `creator.name`
- `creator.location`
- `currency`
- `pledged` (tổng đã raise)
- `goal`
- `backers`
- `daysLeft`
- `campaignStatus`

**KPI hiển thị:**

- Big number: `pledged` + `currency`.
- Subtext: `pledged of {currency} {goal}`.
- Progress bar: `progressPercent`.
- Badges: `backers`, `daysLeft`, `status`.

**UI:**

- Giữ style tương tự `CampaignHeader` public page nhưng chuyển ngữ sang "Founder view" (thêm menu quản lý / actions ở bên).

### 3.2. Section – Performance Over Time (Timeline)

**Field:**

- Pledges của riêng campaign này, group theo thời gian:
  - `sum(pledge.amount)` by day.
  - `count(pledge.id)` by day.

**Biểu đồ:**

- **Area/Line chart**:
  - X: date.
  - Y: amount raised.
- Option toggle: `Amount` / `Backers`.
- Optional overlay: campaign `startDate` / `endDate` (vertical lines).

### 3.3. Section – Reward Performance

**Câu hỏi Founder:**

- Tier nào bán tốt nhất?
- Tier nào sắp hết slot?

**Field (từ Reward + Pledge):**

- Per reward:
  - `reward.title`
  - `minPledgedAmount`
  - `backersCount` = count(pledge where rewardId = this.id).
  - `totalRaisedPerReward = sum(pledge.amount where rewardId = this.id)`.
  - `limitTotal`
  - `claimedCount` (backersCount).
  - `remainingSlots = limitTotal - claimedCount` (nếu có limit).
  - `estimatedDelivery`.

**UI:**

- Bảng "Reward Performance":
  - Columns: Reward, Price, Backers, Total Raised, Limit, Remaining, Est. Delivery.
  - Sort by `Backers` hoặc `Total Raised`.
- **Bar chart**:
  - X: reward.title.
  - Y: backers hoặc totalRaised.

### 3.4. Section – Backer Cohorts & Geography (nếu có data)

**Field (đề xuất thêm nếu chưa có):**

- `backer.country`
- `backer.city`
- `firstPledgeAt`

**KPI:**

- Top 5 quốc gia đóng góp nhiều nhất.
- New vs Returning backers cho campaign này.

**Biểu đồ:**

- Donut chart: `revenue by country`.
- Small bar: `New vs Returning backers`.

### 3.5. Section – Timeline / Milestones

Nếu campaign có các mốc (launch, đạt 25%, 50%, 100%, stretch goals, media mentions, ...), Founder cần nhìn lại dòng thời gian.

**Field (đề xuất thêm):**

- `milestone.type` (LAUNCHED, REACHED_50, REACHED_100, NEW_REWARD, PRESS_MENTION,...)
- `milestone.date`
- `milestone.description`

**UI:**

- Timeline vertical card:
  - Mốc thời gian, icon, mô tả ngắn.

### 3.6. Section – Health & Alerts

**Câu hỏi Founder:**

- Campaign của mình có "ổn" không? Có rủi ro không đạt mục tiêu không?

**Field/KPI:**

- `Projected Funding` (nếu sau này có predictive analytics).
- `Current Velocity` = amount raised / days since start.
- `Required Velocity` = remaining amount / days left.

**Logic đơn giản:**

- Nếu `currentVelocity < requiredVelocity * 0.7` → cảnh báo "Nguy cơ không đạt mục tiêu".
- Nếu `daysLeft <= 3` & `progress < 60%` → highlight đỏ.

**UI:**

- Card "Campaign Health":
  - Badge: `Healthy` / `At Risk` / `Critical`.
  - Short explanation + suggested actions (ví dụ: "Tăng truyền thông, tạo reward flash sale").

---

## 4. UX tổng quan & Layout gợi ý

### 4.1. Founder Overview Dashboard Layout

- **Header:**

  - Title: "Founder Dashboard".
  - Filter toàn cục: `Time range`, `Currency`, `Campaign filter`.

- **Row 1:** Global KPI cards (Total Raised, Total Backers, Active Campaigns, Success Rate, This Month Raised).
- **Row 2:** Revenue & Backers Over Time (line/area chart full width).
- **Row 3:**
  - Left: Top Campaigns table.
  - Right: Top Campaigns by Revenue bar chart.
- **Row 4:**
  - Left: Funnel / Sources (nếu có tracking).
  - Right: Recent Activity / Live Feed.

### 4.2. Campaign Dashboard Layout

- **Header:** Campaign snapshot (title, image, status, progress, key metrics).
- **Row 1:**
  - Area chart: Performance Over Time.
- **Row 2:**
  - Left: Reward Performance table.
  - Right: Reward bar chart.
- **Row 3 (optional, nếu có data):**
  - Left: Backer Geography (map hoặc donut chart).
  - Right: New vs Returning backers.
- **Row 4:**
  - Health & Alerts card.
  - Milestones timeline.

---

## 5. Gợi ý API & field cần bổ sung

Để thực hiện được dashboard như trên, ngoài các endpoint hiện có (`/campaigns`, `/campaigns/{id}/pledges`, `/users/me/pledges`, `/campaigns/{id}/rewards`...), nên bổ sung/thống nhất thêm:

1. **Campaign summary cho Founder**

   - Endpoint: `GET /founder/me/campaigns/summary`.
   - Trả về mỗi campaign:
     - `campaignId`
     - `title`
     - `category`
     - `status`
     - `goalAmount`
     - `totalRaised`
     - `backersCount`
     - `startDate`, `endDate`

2. **Founder global stats**

   - Endpoint: `GET /founder/me/stats?from=&to=`.
   - Trả về:
     - `totalRaised`
     - `totalBackers`
     - `activeCampaigns`
     - `successRate`
     - `monthlyBreakdown[]` (date, raised, backers).

3. **Campaign analytics**
   - Endpoint: `GET /campaigns/{id}/analytics?from=&to=`.
   - Trả về:
     - `timeSeries[]` (date, raised, backers).
     - `rewards[]` (rewardId, title, price, backersCount, totalRaised, limitTotal, remainingSlots).
     - Optional: `sources[]`, `geo[]`, `health`.

Tài liệu này dùng làm base để refine thêm sau khi backend/PM confirm khả năng và ưu tiên.
