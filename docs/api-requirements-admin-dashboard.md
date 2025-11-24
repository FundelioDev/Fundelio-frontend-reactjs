# API Requirements - Admin Dashboard

## Endpoint: `GET /api/admin/dashboard`

### Mục đích

API này cung cấp dữ liệu tổng quan cho Dashboard Admin, bao gồm thống kê tổng thể về hệ thống, người dùng, founders, chiến dịch và các biểu đồ phân tích.

---

## JSON Response Structure

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalFounders": 156,
      "totalCampaigns": 342,
      "pendingCampaigns": 23,
      "totalPledged": 15750000000,
      "activeCampaigns": 89,
      "successRate": 67.5
    },
    "trends": {
      "foundersGrowth": 12.5,
      "campaignsGrowth": 8.3,
      "pledgedGrowth": 15.7
    },
    "userGrowth": {
      "labels": ["T9/24", "T10/24", "T11/24", "T12/24", "T1/25", "T2/25"],
      "data": [23, 31, 45, 52, 61, 73]
    },
    "founderGrowth": {
      "labels": ["T9/24", "T10/24", "T11/24", "T12/24", "T1/25", "T2/25"],
      "data": [12, 18, 25, 32, 41, 48]
    },
    "campaignsPerformance": {
      "labels": ["T9/24", "T10/24", "T11/24", "T12/24", "T1/25", "T2/25"],
      "newCampaigns": [15, 18, 22, 28, 31, 35],
      "totalPledged": [
        1200000000, 1850000000, 2300000000, 2950000000, 3600000000, 4200000000
      ]
    },
    "campaignsByStatus": {
      "DRAFT": 45,
      "PENDING": 23,
      "APPROVED": 12,
      "ACTIVE": 89,
      "ENDED": 67,
      "SUCCESSFUL": 78,
      "FAILED": 28,
      "REJECTED": 15
    },
    "campaignsByCategory": {
      "TECHNOLOGY": 89,
      "ART": 45,
      "MUSIC": 34,
      "GAMES": 28,
      "FOOD": 23,
      "FASHION": 19,
      "FILM": 31,
      "PUBLISHING": 27,
      "OTHER": 46
    },
    "topFundedCampaigns": [
      {
        "campaignId": "camp-123",
        "title": "Dự án AI cho giáo dục",
        "pledgedAmount": 5200000000,
        "backersCount": 1234,
        "progress": 104.0
      },
      {
        "campaignId": "camp-456",
        "title": "Phim tài liệu thiên nhiên",
        "pledgedAmount": 3800000000,
        "backersCount": 892,
        "progress": 95.0
      }
    ],
    "recentCampaigns": [
      {
        "campaignId": "camp-789",
        "title": "App học tiếng Anh",
        "creatorName": "Nguyễn Văn A",
        "thumbnail": "https://...",
        "status": "PENDING",
        "submittedAt": "2024-11-15T10:30:00Z"
      }
    ]
  }
}
```

---

## Chi tiết các trường dữ liệu

### 1. **overview** (Object) - Thống kê tổng quan

Các trường này được tính từ toàn bộ dữ liệu trong hệ thống.

| Trường             | Kiểu    | Mô tả                                             | Cách tính                                                                       |
| ------------------ | ------- | ------------------------------------------------- | ------------------------------------------------------------------------------- |
| `totalFounders`    | Integer | Tổng số founders (người tạo ít nhất 1 chiến dịch) | `COUNT(DISTINCT user_id FROM campaigns WHERE role = 'FOUNDER')`                 |
| `totalCampaigns`   | Integer | Tổng số chiến dịch (tất cả trạng thái)            | `COUNT(*) FROM campaigns`                                                       |
| `pendingCampaigns` | Integer | Số chiến dịch đang chờ duyệt                      | `COUNT(*) FROM campaigns WHERE status = 'PENDING'`                              |
| `totalPledged`     | Long    | Tổng số tiền đã huy động (VND)                    | `SUM(pledged_amount) FROM campaigns`                                            |
| `activeCampaigns`  | Integer | Số chiến dịch đang hoạt động                      | `COUNT(*) FROM campaigns WHERE status = 'ACTIVE'`                               |
| `successRate`      | Float   | Tỷ lệ thành công (%)                              | `(COUNT(status='SUCCESSFUL') / COUNT(status IN ('SUCCESSFUL','FAILED'))) * 100` |

### 2. **trends** (Object) - Xu hướng tăng trưởng

So sánh với tháng trước

| Trường            | Kiểu  | Mô tả                         | Cách tính                                                                      |
| ----------------- | ----- | ----------------------------- | ------------------------------------------------------------------------------ |
| `foundersGrowth`  | Float | Tăng trưởng số founders (%)   | `((founders_this_month - founders_last_month) / founders_last_month) * 100`    |
| `campaignsGrowth` | Float | Tăng trưởng số chiến dịch (%) | `((campaigns_this_month - campaigns_last_month) / campaigns_last_month) * 100` |
| `pledgedGrowth`   | Float | Tăng trưởng tổng gây quỹ (%)  | `((pledged_this_month - pledged_last_month) / pledged_last_month) * 100`       |

### 3. **userGrowth** (Object) - Biểu đồ tăng trưởng người dùng

Dữ liệu cho Line Chart theo tháng (6 tháng gần nhất)

| Trường   | Kiểu           | Mô tả                        | Cách tính                                                            |
| -------- | -------------- | ---------------------------- | -------------------------------------------------------------------- |
| `labels` | Array[String]  | Nhãn tháng (format: "T9/24") | Tạo từ 6 tháng gần nhất                                              |
| `data`   | Array[Integer] | Số người dùng mới mỗi tháng  | `COUNT(*) FROM users WHERE MONTH(created_at) = month GROUP BY month` |

### 4. **founderGrowth** (Object) - Biểu đồ tăng trưởng founders

Dữ liệu cho Line Chart tích lũy theo tháng (6 tháng gần nhất)

| Trường   | Kiểu           | Mô tả                                   | Cách tính                                                                                |
| -------- | -------------- | --------------------------------------- | ---------------------------------------------------------------------------------------- |
| `labels` | Array[String]  | Nhãn tháng                              | Tạo từ 6 tháng gần nhất                                                                  |
| `data`   | Array[Integer] | Số founders tích lũy đến cuối mỗi tháng | `COUNT(DISTINCT user_id) FROM campaigns WHERE created_at <= end_of_month GROUP BY month` |

### 5. **campaignsPerformance** (Object) - Hiệu suất chiến dịch

Dữ liệu cho Combined Chart (Bar + Line) theo tháng (6 tháng gần nhất)

| Trường         | Kiểu           | Mô tả                             | Cách tính                                                                           |
| -------------- | -------------- | --------------------------------- | ----------------------------------------------------------------------------------- |
| `labels`       | Array[String]  | Nhãn tháng                        | Tạo từ 6 tháng gần nhất                                                             |
| `newCampaigns` | Array[Integer] | Số chiến dịch mới mỗi tháng       | `COUNT(*) FROM campaigns WHERE MONTH(created_at) = month GROUP BY month`            |
| `totalPledged` | Array[Long]    | Tổng tiền gây quỹ mỗi tháng (VND) | `SUM(pledged_amount) FROM campaigns WHERE MONTH(created_at) = month GROUP BY month` |

### 6. **campaignsByStatus** (Object) - Phân bố theo trạng thái

Dữ liệu cho Bar Chart

| Trường       | Kiểu    | Mô tả                            | Cách tính                                             |
| ------------ | ------- | -------------------------------- | ----------------------------------------------------- |
| `DRAFT`      | Integer | Số chiến dịch ở trạng thái DRAFT | `COUNT(*) FROM campaigns WHERE status = 'DRAFT'`      |
| `PENDING`    | Integer | Số chiến dịch đang chờ duyệt     | `COUNT(*) FROM campaigns WHERE status = 'PENDING'`    |
| `APPROVED`   | Integer | Số chiến dịch đã được duyệt      | `COUNT(*) FROM campaigns WHERE status = 'APPROVED'`   |
| `ACTIVE`     | Integer | Số chiến dịch đang hoạt động     | `COUNT(*) FROM campaigns WHERE status = 'ACTIVE'`     |
| `ENDED`      | Integer | Số chiến dịch đã kết thúc        | `COUNT(*) FROM campaigns WHERE status = 'ENDED'`      |
| `SUCCESSFUL` | Integer | Số chiến dịch thành công         | `COUNT(*) FROM campaigns WHERE status = 'SUCCESSFUL'` |
| `FAILED`     | Integer | Số chiến dịch thất bại           | `COUNT(*) FROM campaigns WHERE status = 'FAILED'`     |
| `REJECTED`   | Integer | Số chiến dịch bị từ chối         | `COUNT(*) FROM campaigns WHERE status = 'REJECTED'`   |

### 7. **campaignsByCategory** (Object) - Phân bố theo danh mục

Dữ liệu cho Doughnut Chart

| Trường       | Kiểu    | Mô tả                             | Cách tính                                               |
| ------------ | ------- | --------------------------------- | ------------------------------------------------------- |
| `TECHNOLOGY` | Integer | Số chiến dịch danh mục Công nghệ  | `COUNT(*) FROM campaigns WHERE category = 'TECHNOLOGY'` |
| `ART`        | Integer | Số chiến dịch danh mục Nghệ thuật | `COUNT(*) FROM campaigns WHERE category = 'ART'`        |
| `MUSIC`      | Integer | Số chiến dịch danh mục Âm nhạc    | `COUNT(*) FROM campaigns WHERE category = 'MUSIC'`      |
| `GAMES`      | Integer | Số chiến dịch danh mục Trò chơi   | `COUNT(*) FROM campaigns WHERE category = 'GAMES'`      |
| `FOOD`       | Integer | Số chiến dịch danh mục Thực phẩm  | `COUNT(*) FROM campaigns WHERE category = 'FOOD'`       |
| `FASHION`    | Integer | Số chiến dịch danh mục Thời trang | `COUNT(*) FROM campaigns WHERE category = 'FASHION'`    |
| `FILM`       | Integer | Số chiến dịch danh mục Phim ảnh   | `COUNT(*) FROM campaigns WHERE category = 'FILM'`       |
| `PUBLISHING` | Integer | Số chiến dịch danh mục Xuất bản   | `COUNT(*) FROM campaigns WHERE category = 'PUBLISHING'` |
| `OTHER`      | Integer | Số chiến dịch danh mục Khác       | `COUNT(*) FROM campaigns WHERE category = 'OTHER'`      |

### 8. **topFundedCampaigns** (Array) - Top 10 chiến dịch gây quỹ cao nhất

Dữ liệu cho Horizontal Bar Chart

| Trường          | Kiểu    | Mô tả                    | Cách tính                                              |
| --------------- | ------- | ------------------------ | ------------------------------------------------------ |
| `campaignId`    | String  | ID chiến dịch            | Từ database                                            |
| `title`         | String  | Tên chiến dịch           | Từ database                                            |
| `pledgedAmount` | Long    | Số tiền đã gây quỹ (VND) | Từ database                                            |
| `backersCount`  | Integer | Số người ủng hộ          | `COUNT(*) FROM pledges WHERE campaign_id = campaignId` |
| `progress`      | Float   | Tiến độ (%)              | `(pledged_amount / goal_amount) * 100`                 |

**Query gợi ý:**

```sql
SELECT campaign_id, title, pledged_amount, backers_count,
       (pledged_amount / goal_amount * 100) as progress
FROM campaigns
ORDER BY pledged_amount DESC
LIMIT 10
```

### 9. **recentCampaigns** (Array) - 5 chiến dịch gần đây nhất

Danh sách chiến dịch mới submit

| Trường        | Kiểu              | Mô tả                 | Cách tính                                    |
| ------------- | ----------------- | --------------------- | -------------------------------------------- |
| `campaignId`  | String            | ID chiến dịch         | Từ database                                  |
| `title`       | String            | Tên chiến dịch        | Từ database                                  |
| `creatorName` | String            | Tên người tạo         | `JOIN users ON campaigns.user_id = users.id` |
| `thumbnail`   | String            | URL ảnh thumbnail     | Từ database                                  |
| `status`      | String            | Trạng thái chiến dịch | Từ database                                  |
| `submittedAt` | String (ISO 8601) | Ngày gửi duyệt        | Từ database                                  |

**Query gợi ý:**

```sql
SELECT c.campaign_id, c.title, u.name as creator_name,
       c.thumbnail, c.status, c.submitted_at
FROM campaigns c
JOIN users u ON c.user_id = u.id
ORDER BY c.submitted_at DESC
LIMIT 5
```

---

## Notes cho Backend Team

### Performance Optimization

1. **Caching**: Các thống kê tổng quan nên được cache (Redis) với TTL 5-10 phút vì không cần real-time tuyệt đối
2. **Indexing**: Đảm bảo có index trên các cột:
   - `campaigns.status`
   - `campaigns.category`
   - `campaigns.created_at`
   - `campaigns.user_id`
   - `pledges.campaign_id`

### Data Aggregation

1. Nên có bảng aggregation riêng để lưu trữ thống kê theo ngày/tháng để tránh query nặng
2. Có thể dùng materialized view hoặc scheduled job để tính toán trước

### Error Handling

- Nếu không có dữ liệu, trả về giá trị mặc định (0, [], {})
- Không để API fail nếu 1 phần dữ liệu bị lỗi

### Security

- Endpoint này chỉ dành cho Admin role
- Cần check quyền truy cập trước khi trả dữ liệu

---

## Example cURL Request

```bash
curl -X GET "https://api.fundelio.com/api/admin/dashboard" \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json"
```

---

**Người tạo:** Frontend Team  
**Ngày tạo:** 20/11/2024  
**Version:** 1.0
