# API Requirements - Founder Dashboard (Tổng quan tất cả chiến dịch)

## Endpoint: `GET /api/founder/dashboard`

### Mục đích

API này cung cấp dữ liệu tổng quan cho Dashboard Founder, hiển thị thống kê về TẤT CẢ các chiến dịch mà founder đã tạo.

---

## JSON Response Structure

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalPledged": 45600000,
      "totalBackers": 234,
      "totalCampaigns": 8,
      "successfulCampaigns": 3,
      "successRate": 75.0
    },
    "trends": {
      "pledgedTrend": 12.5,
      "backersTrend": 8.3,
      "campaignsTrend": 0,
      "successRateTrend": 5.2
    },
    "weeklyProgress": {
      "labels": ["T1", "T2", "T3", "T4", "T5", "T6", "T7"],
      "data": [3200000, 4100000, 5300000, 6800000, 9200000, 12500000, 15800000]
    },
    "campaignsByStatus": {
      "DRAFT": 2,
      "PENDING": 1,
      "APPROVED": 0,
      "ACTIVE": 3,
      "ENDED": 1,
      "SUCCESSFUL": 3,
      "FAILED": 1,
      "REJECTED": 0
    },
    "topCampaigns": [
      {
        "campaignId": "camp-123",
        "title": "Dự án App Học tiếng Anh",
        "pledgedAmount": 18500000,
        "goalAmount": 20000000,
        "backersCount": 89,
        "progress": 92.5,
        "status": "ACTIVE"
      },
      {
        "campaignId": "camp-456",
        "title": "Game lịch sử Việt Nam",
        "pledgedAmount": 12300000,
        "goalAmount": 15000000,
        "backersCount": 67,
        "progress": 82.0,
        "status": "ACTIVE"
      }
    ],
    "recentActivities": [
      {
        "campaignId": "camp-789",
        "title": "Phim ngắn về môi trường",
        "pledgedAmount": 5600000,
        "goalAmount": 10000000,
        "backersCount": 23,
        "status": "ACTIVE",
        "updatedAt": "2024-11-18T14:30:00Z",
        "createdAt": "2024-11-01T10:00:00Z"
      }
    ]
  }
}
```

---

## Chi tiết các trường dữ liệu

### 1. **overview** (Object) - Thống kê tổng quan

Tổng hợp từ tất cả chiến dịch của founder hiện tại

| Trường                | Kiểu    | Mô tả                                              | Cách tính                                                                                                           |
| --------------------- | ------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `totalPledged`        | Long    | Tổng số tiền đã gây quỹ từ tất cả chiến dịch (VND) | `SUM(pledged_amount) FROM campaigns WHERE user_id = current_user_id`                                                |
| `totalBackers`        | Integer | Tổng số người ủng hộ (unique)                      | `COUNT(DISTINCT user_id) FROM pledges p JOIN campaigns c ON p.campaign_id = c.id WHERE c.user_id = current_user_id` |
| `totalCampaigns`      | Integer | Tổng số chiến dịch đã tạo                          | `COUNT(*) FROM campaigns WHERE user_id = current_user_id`                                                           |
| `successfulCampaigns` | Integer | Số chiến dịch thành công                           | `COUNT(*) FROM campaigns WHERE user_id = current_user_id AND status = 'SUCCESSFUL'`                                 |
| `successRate`         | Float   | Tỷ lệ thành công (%)                               | `(successful_campaigns / ended_campaigns) * 100` where ended_campaigns = SUCCESSFUL + FAILED                        |

### 2. **trends** (Object) - Xu hướng so với tuần trước

So sánh metrics hiện tại vs 7 ngày trước

| Trường             | Kiểu  | Mô tả                         | Cách tính                                                                   |
| ------------------ | ----- | ----------------------------- | --------------------------------------------------------------------------- |
| `pledgedTrend`     | Float | Tăng trưởng tổng gây quỹ (%)  | `((pledged_this_week - pledged_last_week) / pledged_last_week) * 100`       |
| `backersTrend`     | Float | Tăng trưởng số backers (%)    | `((backers_this_week - backers_last_week) / backers_last_week) * 100`       |
| `campaignsTrend`   | Float | Tăng trưởng số chiến dịch (%) | `((campaigns_this_week - campaigns_last_week) / campaigns_last_week) * 100` |
| `successRateTrend` | Float | Thay đổi tỷ lệ thành công (%) | `current_success_rate - last_week_success_rate`                             |

**Lưu ý:**

- Nếu không có dữ liệu tuần trước, trả về 0
- "This week" = 7 ngày gần nhất, "Last week" = 7 ngày trước đó

### 3. **weeklyProgress** (Object) - Tiến độ gây quỹ theo tuần

Dữ liệu cho Area/Line Chart - Tích lũy theo ngày (7 ngày gần nhất)

| Trường   | Kiểu          | Mô tả                                              | Cách tính                                |
| -------- | ------------- | -------------------------------------------------- | ---------------------------------------- |
| `labels` | Array[String] | Nhãn các ngày (T1-T7)                              | 7 ngày gần nhất                          |
| `data`   | Array[Long]   | Tổng tiền gây quỹ tích lũy đến cuối mỗi ngày (VND) | Cumulative sum of pledges up to each day |

**Query gợi ý:**

```sql
-- For each of last 7 days
SELECT
  DATE(p.created_at) as date,
  SUM(p.amount) OVER (ORDER BY DATE(p.created_at)) as cumulative_amount
FROM pledges p
JOIN campaigns c ON p.campaign_id = c.id
WHERE c.user_id = current_user_id
  AND p.created_at >= CURDATE() - INTERVAL 7 DAY
GROUP BY DATE(p.created_at)
ORDER BY date
```

### 4. **campaignsByStatus** (Object) - Phân bố theo trạng thái

Dữ liệu cho Doughnut Chart

| Trường       | Kiểu    | Mô tả                        | Cách tính                                                                           |
| ------------ | ------- | ---------------------------- | ----------------------------------------------------------------------------------- |
| `DRAFT`      | Integer | Số chiến dịch nháp           | `COUNT(*) FROM campaigns WHERE user_id = current_user_id AND status = 'DRAFT'`      |
| `PENDING`    | Integer | Số chiến dịch chờ duyệt      | `COUNT(*) FROM campaigns WHERE user_id = current_user_id AND status = 'PENDING'`    |
| `APPROVED`   | Integer | Số chiến dịch đã duyệt       | `COUNT(*) FROM campaigns WHERE user_id = current_user_id AND status = 'APPROVED'`   |
| `ACTIVE`     | Integer | Số chiến dịch đang hoạt động | `COUNT(*) FROM campaigns WHERE user_id = current_user_id AND status = 'ACTIVE'`     |
| `ENDED`      | Integer | Số chiến dịch đã kết thúc    | `COUNT(*) FROM campaigns WHERE user_id = current_user_id AND status = 'ENDED'`      |
| `SUCCESSFUL` | Integer | Số chiến dịch thành công     | `COUNT(*) FROM campaigns WHERE user_id = current_user_id AND status = 'SUCCESSFUL'` |
| `FAILED`     | Integer | Số chiến dịch thất bại       | `COUNT(*) FROM campaigns WHERE user_id = current_user_id AND status = 'FAILED'`     |
| `REJECTED`   | Integer | Số chiến dịch bị từ chối     | `COUNT(*) FROM campaigns WHERE user_id = current_user_id AND status = 'REJECTED'`   |

### 5. **topCampaigns** (Array) - Top 5 chiến dịch gây quỹ cao nhất

Dữ liệu cho Horizontal Bar Chart

| Trường          | Kiểu    | Mô tả                    | Cách tính                                              |
| --------------- | ------- | ------------------------ | ------------------------------------------------------ |
| `campaignId`    | String  | ID chiến dịch            | Từ database                                            |
| `title`         | String  | Tên chiến dịch           | Từ database                                            |
| `pledgedAmount` | Long    | Số tiền đã gây quỹ (VND) | Từ database                                            |
| `goalAmount`    | Long    | Mục tiêu gây quỹ (VND)   | Từ database                                            |
| `backersCount`  | Integer | Số người ủng hộ          | `COUNT(*) FROM pledges WHERE campaign_id = campaignId` |
| `progress`      | Float   | Tiến độ (%)              | `(pledged_amount / goal_amount) * 100`                 |
| `status`        | String  | Trạng thái chiến dịch    | Từ database                                            |

**Query gợi ý:**

```sql
SELECT
  c.campaign_id,
  c.title,
  c.pledged_amount,
  c.goal_amount,
  c.backers_count,
  (c.pledged_amount / c.goal_amount * 100) as progress,
  c.status
FROM campaigns c
WHERE c.user_id = current_user_id
ORDER BY c.pledged_amount DESC
LIMIT 5
```

### 6. **recentActivities** (Array) - 5 hoạt động gần đây

Danh sách chiến dịch có hoạt động gần nhất (sắp xếp theo updatedAt)

| Trường          | Kiểu              | Mô tả                    | Cách tính                                |
| --------------- | ----------------- | ------------------------ | ---------------------------------------- |
| `campaignId`    | String            | ID chiến dịch            | Từ database                              |
| `title`         | String            | Tên chiến dịch           | Từ database                              |
| `pledgedAmount` | Long              | Số tiền đã gây quỹ (VND) | Từ database                              |
| `goalAmount`    | Long              | Mục tiêu gây quỹ (VND)   | Từ database                              |
| `backersCount`  | Integer           | Số người ủng hộ          | Từ database hoặc `COUNT(*) FROM pledges` |
| `status`        | String            | Trạng thái chiến dịch    | Từ database                              |
| `updatedAt`     | String (ISO 8601) | Ngày cập nhật gần nhất   | Từ database                              |
| `createdAt`     | String (ISO 8601) | Ngày tạo chiến dịch      | Từ database                              |

**Query gợi ý:**

```sql
SELECT
  c.campaign_id,
  c.title,
  c.pledged_amount,
  c.goal_amount,
  c.backers_count,
  c.status,
  c.updated_at,
  c.created_at
FROM campaigns c
WHERE c.user_id = current_user_id
ORDER BY c.updated_at DESC
LIMIT 5
```

---

## Query Parameters (Optional)

| Parameter      | Type    | Mô tả                                                   | Default |
| -------------- | ------- | ------------------------------------------------------- | ------- |
| `timeRange`    | String  | Khoảng thời gian lọc dữ liệu: "7d", "30d", "90d", "all" | "all"   |
| `includeEnded` | Boolean | Có tính chiến dịch đã kết thúc không                    | true    |

---

## Notes cho Backend Team

### Authentication & Authorization

- Endpoint này yêu cầu JWT token
- Chỉ trả về dữ liệu của campaigns thuộc về user hiện tại
- Verify user có role FOUNDER hoặc cao hơn

### Performance Optimization

1. **Eager Loading**: Load sẵn backers_count trong campaigns table thay vì COUNT mỗi lần
2. **Caching**: Cache kết quả trong 2-5 phút (Redis)
3. **Indexing**: Index trên:
   - `campaigns.user_id`
   - `campaigns.status`
   - `campaigns.updated_at`
   - `pledges.campaign_id`
   - `pledges.created_at`

### Data Consistency

- Nếu `pledged_amount` không đồng bộ, tính lại từ bảng pledges:
  ```sql
  SELECT SUM(amount) FROM pledges WHERE campaign_id = X AND status = 'COMPLETED'
  ```

### Edge Cases

- Founder chưa có chiến dịch nào: Trả về overview với giá trị 0, arrays rỗng
- Tuần trước không có dữ liệu: trend = 0
- Division by zero: Luôn check trước khi chia

---

## Example cURL Request

```bash
curl -X GET "https://api.fundelio.com/api/founder/dashboard?timeRange=30d" \
  -H "Authorization: Bearer {founder_token}" \
  -H "Content-Type: application/json"
```

---

## Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "User is not a founder or does not have permission"
  }
}
```

---

**Người tạo:** Frontend Team  
**Ngày tạo:** 20/11/2024  
**Version:** 1.0
