# API Requirements - Campaign Dashboard (Dashboard từng chiến dịch)

## Endpoint: `GET /api/campaigns/:campaignId/statistics`

### Mục đích

API này cung cấp dữ liệu thống kê chi tiết cho MỘT chiến dịch cụ thể, bao gồm các metrics, biểu đồ phân tích và dữ liệu về pledges, backers.

---

## JSON Response Structure

```json
{
  "success": true,
  "data": {
    "campaign": {
      "campaignId": "camp-123",
      "title": "Dự án App Học tiếng Anh",
      "goalAmount": 20000000,
      "pledgedAmount": 18500000,
      "currentAmount": 18500000,
      "backersCount": 234,
      "currency": "VND",
      "status": "ACTIVE",
      "startDate": "2024-10-01T00:00:00Z",
      "endDate": "2024-12-01T00:00:00Z",
      "createdAt": "2024-09-25T10:30:00Z",
      "updatedAt": "2024-11-18T14:25:00Z"
    },
    "metrics": {
      "progressPercent": 92.5,
      "daysElapsed": 48,
      "daysLeft": 12,
      "avgDailyPledge": 385416,
      "avgPledgeAmount": 79059,
      "projectedFinalAmount": 19850000,
      "successProbability": 85.5
    },
    "fundingTimeline": {
      "labels": ["01/11", "02/11", "03/11", "04/11", "05/11", "..."],
      "data": [500000, 1200000, 2100000, 3500000, 5200000, "..."]
    },
    "pledgesDistribution": {
      "ranges": ["< 100K", "100K-500K", "500K-1M", "1M-5M", "> 5M"],
      "counts": [145, 62, 18, 7, 2]
    },
    "pledges": [
      {
        "pledgeId": "pledge-1",
        "userId": "user-456",
        "backerName": "Nguyễn Văn A",
        "pledgeAmount": 250000,
        "status": "COMPLETED",
        "createdAt": "2024-11-18T09:30:00Z"
      },
      {
        "pledgeId": "pledge-2",
        "userId": "user-789",
        "backerName": "Trần Thị B",
        "pledgeAmount": 500000,
        "status": "COMPLETED",
        "createdAt": "2024-11-17T16:45:00Z"
      }
    ],
    "topBackers": [
      {
        "userId": "user-999",
        "backerName": "Lê Văn C",
        "totalPledged": 2500000,
        "pledgeCount": 3,
        "firstPledgeDate": "2024-10-05T10:00:00Z"
      }
    ],
    "performanceIndicators": {
      "avgPledge": 79059,
      "dailyAvg": 385416,
      "projected": 19850000,
      "successProbability": 85.5,
      "currentVelocity": 385416,
      "requiredVelocity": 125000
    },
    "founderOps": {
      "summaryMetrics": {
        "weeklyCash": 2700000,
        "weeklyTrend": 15.3,
        "projectedAmount": 19850000,
        "runwayCoverage": 99.25,
        "gapToGoal": 1500000,
        "daysLeft": 12,
        "avgDaily": 385416,
        "requiredDaily": 125000
      },
      "priorities": [
        {
          "title": "Tốc độ gây quỹ chưa đạt",
          "description": "Thiếu khoảng 100.000đ mỗi ngày để bắt kịp mục tiêu",
          "severity": "critical"
        }
      ],
      "communityMetrics": {
        "newBackers7d": 12,
        "avgTicket": 79059,
        "highValueShare": 0.18,
        "highValueThreshold": 500000,
        "repeatRate": 0.08,
        "totalPledges": 234,
        "uniqueBackers": 215
      }
    }
  }
}
```

---

## Chi tiết các trường dữ liệu

### 1. **campaign** (Object) - Thông tin cơ bản chiến dịch

Thông tin tổng quan về chiến dịch

| Trường          | Kiểu              | Mô tả                                      | Cách lấy                                                          |
| --------------- | ----------------- | ------------------------------------------ | ----------------------------------------------------------------- |
| `campaignId`    | String            | ID chiến dịch                              | Từ database                                                       |
| `title`         | String            | Tên chiến dịch                             | Từ database                                                       |
| `goalAmount`    | Long              | Mục tiêu gây quỹ (VND)                     | Từ database                                                       |
| `pledgedAmount` | Long              | Số tiền đã gây quỹ (VND)                   | Từ database hoặc `SUM(amount) FROM pledges WHERE campaign_id = X` |
| `currentAmount` | Long              | Số tiền hiện tại (alias của pledgedAmount) | Same as pledgedAmount                                             |
| `backersCount`  | Integer           | Số người ủng hộ                            | `COUNT(DISTINCT user_id) FROM pledges WHERE campaign_id = X`      |
| `currency`      | String            | Đơn vị tiền tệ                             | Từ database (default: "VND")                                      |
| `status`        | String            | Trạng thái chiến dịch                      | Từ database                                                       |
| `startDate`     | String (ISO 8601) | Ngày bắt đầu                               | Từ database                                                       |
| `endDate`       | String (ISO 8601) | Ngày kết thúc                              | Từ database                                                       |
| `createdAt`     | String (ISO 8601) | Ngày tạo                                   | Từ database                                                       |
| `updatedAt`     | String (ISO 8601) | Ngày cập nhật                              | Từ database                                                       |

### 2. **metrics** (Object) - Các chỉ số tính toán

Metrics được tính toán từ dữ liệu hiện tại

| Trường                 | Kiểu    | Mô tả                                  | Công thức                                   |
| ---------------------- | ------- | -------------------------------------- | ------------------------------------------- |
| `progressPercent`      | Float   | Tiến độ đạt mục tiêu (%)               | `(pledgedAmount / goalAmount) * 100`        |
| `daysElapsed`          | Integer | Số ngày đã trôi qua từ khi bắt đầu     | `CEIL(DATEDIFF(NOW(), startDate))`          |
| `daysLeft`             | Integer | Số ngày còn lại đến khi kết thúc       | `MAX(0, CEIL(DATEDIFF(endDate, NOW())))`    |
| `avgDailyPledge`       | Long    | Trung bình tiền gây quỹ mỗi ngày (VND) | `pledgedAmount / MAX(1, daysElapsed)`       |
| `avgPledgeAmount`      | Long    | Trung bình mỗi pledge (VND)            | `pledgedAmount / MAX(1, backersCount)`      |
| `projectedFinalAmount` | Long    | Dự báo số tiền cuối kỳ (VND)           | `avgDailyPledge * (daysElapsed + daysLeft)` |
| `successProbability`   | Float   | Xác suất thành công (%)                | Xem công thức phức tạp bên dưới             |

**Công thức tính Success Probability:**

```javascript
if (progressPercent >= 100) {
  successProbability = 100;
} else if (daysLeft === 0) {
  successProbability = progressPercent >= 80 ? 60 : 30;
} else {
  currentVelocity = avgDailyPledge;
  requiredVelocity = (goalAmount - pledgedAmount) / daysLeft;
  velocityScore =
    currentVelocity >= requiredVelocity
      ? 50
      : (currentVelocity / requiredVelocity) * 50;
  progressScore = progressPercent * 0.5;
  successProbability = MIN(95, ROUND(velocityScore + progressScore));
}
```

### 3. **fundingTimeline** (Object) - Timeline gây quỹ

Dữ liệu cho Area/Line Chart theo ngày (30 ngày gần nhất hoặc từ startDate)

| Trường   | Kiểu          | Mô tả                                      | Cách tính                          |
| -------- | ------------- | ------------------------------------------ | ---------------------------------- |
| `labels` | Array[String] | Nhãn ngày (format: "DD/MM")                | 30 ngày gần nhất hoặc từ startDate |
| `data`   | Array[Long]   | Tổng tiền tích lũy đến cuối mỗi ngày (VND) | Cumulative sum of pledges          |

**Query gợi ý:**

```sql
SELECT
  DATE(created_at) as date,
  SUM(amount) OVER (ORDER BY DATE(created_at)) as cumulative
FROM pledges
WHERE campaign_id = :campaignId
  AND created_at >= GREATEST(
    (SELECT start_date FROM campaigns WHERE id = :campaignId),
    CURDATE() - INTERVAL 30 DAY
  )
GROUP BY DATE(created_at)
ORDER BY date
```

### 4. **pledgesDistribution** (Object) - Phân bố pledges theo mức giá

Dữ liệu cho Bar Chart

| Trường   | Kiểu           | Mô tả                             | Cách tính                                                  |
| -------- | -------------- | --------------------------------- | ---------------------------------------------------------- |
| `ranges` | Array[String]  | Nhãn các khoảng giá               | Fixed: ["< 100K", "100K-500K", "500K-1M", "1M-5M", "> 5M"] |
| `counts` | Array[Integer] | Số lượng pledges trong mỗi khoảng | Group by amount ranges                                     |

**Query gợi ý:**

```sql
SELECT
  CASE
    WHEN amount < 100000 THEN 'under100k'
    WHEN amount < 500000 THEN '100kTo500k'
    WHEN amount < 1000000 THEN '500kTo1m'
    WHEN amount < 5000000 THEN '1mTo5m'
    ELSE 'over5m'
  END as range,
  COUNT(*) as count
FROM pledges
WHERE campaign_id = :campaignId
GROUP BY range
```

### 5. **pledges** (Array) - Danh sách pledges gần nhất

20 pledges gần nhất

| Trường         | Kiểu              | Mô tả             | Cách lấy                                 |
| -------------- | ----------------- | ----------------- | ---------------------------------------- |
| `pledgeId`     | String            | ID pledge         | Từ database                              |
| `userId`       | String            | ID người ủng hộ   | Từ database                              |
| `backerName`   | String            | Tên người ủng hộ  | `JOIN users` hoặc "Ẩn danh" nếu null     |
| `pledgeAmount` | Long              | Số tiền (VND)     | Từ database                              |
| `status`       | String            | Trạng thái pledge | Từ database (COMPLETED, PENDING, FAILED) |
| `createdAt`    | String (ISO 8601) | Ngày tạo          | Từ database                              |

**Query gợi ý:**

```sql
SELECT
  p.pledge_id,
  p.user_id,
  COALESCE(CONCAT(u.first_name, ' ', u.last_name), 'Ẩn danh') as backer_name,
  p.amount as pledge_amount,
  p.status,
  p.created_at
FROM pledges p
LEFT JOIN users u ON p.user_id = u.id
WHERE p.campaign_id = :campaignId
ORDER BY p.created_at DESC
LIMIT 20
```

### 6. **topBackers** (Array) - Top 5 người ủng hộ nhiều nhất

Dữ liệu hiển thị trong panel riêng

| Trường            | Kiểu              | Mô tả                                           | Cách tính                                                            |
| ----------------- | ----------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| `userId`          | String            | ID người ủng hộ                                 | Từ database                                                          |
| `backerName`      | String            | Tên người ủng hộ                                | `JOIN users` hoặc "Ẩn danh"                                          |
| `totalPledged`    | Long              | Tổng số tiền đã ủng hộ cho chiến dịch này (VND) | `SUM(amount) FROM pledges WHERE campaign_id = X AND user_id = Y`     |
| `pledgeCount`     | Integer           | Số lần ủng hộ                                   | `COUNT(*) FROM pledges WHERE campaign_id = X AND user_id = Y`        |
| `firstPledgeDate` | String (ISO 8601) | Ngày ủng hộ lần đầu                             | `MIN(created_at) FROM pledges WHERE campaign_id = X AND user_id = Y` |

**Query gợi ý:**

```sql
SELECT
  p.user_id,
  COALESCE(CONCAT(u.first_name, ' ', u.last_name), 'Ẩn danh') as backer_name,
  SUM(p.amount) as total_pledged,
  COUNT(*) as pledge_count,
  MIN(p.created_at) as first_pledge_date
FROM pledges p
LEFT JOIN users u ON p.user_id = u.id
WHERE p.campaign_id = :campaignId
  AND p.status = 'COMPLETED'
GROUP BY p.user_id, backer_name
ORDER BY total_pledged DESC
LIMIT 5
```

### 7. **performanceIndicators** (Object) - Chỉ số hiệu suất

Các metrics để hiển thị trong Performance Cards

| Trường               | Kiểu  | Mô tả                        | Công thức                                         |
| -------------------- | ----- | ---------------------------- | ------------------------------------------------- |
| `avgPledge`          | Long  | Pledge trung bình (VND)      | `pledgedAmount / backersCount`                    |
| `dailyAvg`           | Long  | Trung bình mỗi ngày (VND)    | `pledgedAmount / daysElapsed`                     |
| `projected`          | Long  | Dự kiến cuối cùng (VND)      | `dailyAvg * (daysElapsed + daysLeft)`             |
| `successProbability` | Float | Tỷ lệ thành công (%)         | Công thức như trên                                |
| `currentVelocity`    | Long  | Vận tốc hiện tại (VND/ngày)  | `dailyAvg`                                        |
| `requiredVelocity`   | Long  | Vận tốc cần thiết (VND/ngày) | `(goalAmount - pledgedAmount) / MAX(1, daysLeft)` |

### 8. **founderOps** (Object) - Command Center cho Founder

Dữ liệu cho Founder Management Panel và Community Insights

#### 8.1. **summaryMetrics** (Object)

| Trường            | Kiểu    | Mô tả                            | Công thức                                                                                 |
| ----------------- | ------- | -------------------------------- | ----------------------------------------------------------------------------------------- |
| `weeklyCash`      | Long    | Dòng tiền 7 ngày gần nhất (VND)  | `SUM(amount) FROM pledges WHERE campaign_id = X AND created_at >= NOW() - INTERVAL 7 DAY` |
| `weeklyTrend`     | Float   | Tăng trưởng vs tuần trước (%)    | `((this_week - last_week) / last_week) * 100`                                             |
| `projectedAmount` | Long    | Dự báo cuối kỳ (VND)             | `avgDailyPledge * totalDays`                                                              |
| `runwayCoverage`  | Float   | Tỷ lệ dự báo so với mục tiêu (%) | `(projectedAmount / goalAmount) * 100`                                                    |
| `gapToGoal`       | Long    | Khoảng cách đến mục tiêu (VND)   | `MAX(0, goalAmount - pledgedAmount)`                                                      |
| `daysLeft`        | Integer | Ngày còn lại                     | From campaign data                                                                        |
| `avgDaily`        | Long    | Tốc độ huy động (VND/ngày)       | `pledgedAmount / daysElapsed`                                                             |
| `requiredDaily`   | Long    | Tốc độ cần thiết (VND/ngày)      | `gapToGoal / MAX(1, daysLeft)`                                                            |

#### 8.2. **priorities** (Array) - Ưu tiên hành động

Tự động phát hiện vấn đề và đề xuất

| Trường        | Kiểu   | Mô tả                                            | Logic                              |
| ------------- | ------ | ------------------------------------------------ | ---------------------------------- |
| `title`       | String | Tiêu đề ưu tiên                                  | Auto-generated based on conditions |
| `description` | String | Mô tả chi tiết                                   | Auto-generated                     |
| `severity`    | String | Mức độ: "critical", "warning", "info", "success" | Auto-detected                      |

**Logic phát hiện:**

```javascript
if (requiredDaily > avgDaily && daysLeft > 0) {
  priorities.push({
    title: "Tốc độ gây quỹ chưa đạt",
    description: `Thiếu khoảng ${formatCurrency(
      requiredDaily - avgDaily
    )} mỗi ngày để bắt kịp mục tiêu`,
    severity: "critical",
  });
}
```

#### 8.3. **communityMetrics** (Object) - Thống kê cộng đồng

| Trường               | Kiểu    | Mô tả                             | Công thức                                                                                             |
| -------------------- | ------- | --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `newBackers7d`       | Integer | Backer mới trong 7 ngày           | `COUNT(DISTINCT user_id) FROM pledges WHERE campaign_id = X AND created_at >= NOW() - INTERVAL 7 DAY` |
| `avgTicket`          | Long    | Avg ticket size (VND)             | `pledgedAmount / backersCount`                                                                        |
| `highValueShare`     | Float   | Tỷ trọng pledge lớn (ratio 0-1)   | `SUM(amount WHERE amount >= 500000) / pledgedAmount`                                                  |
| `highValueThreshold` | Long    | Ngưỡng pledge lớn (VND)           | Fixed: 500000                                                                                         |
| `repeatRate`         | Float   | Tỷ lệ backer quay lại (ratio 0-1) | `(totalPledges - uniqueBackers) / totalPledges`                                                       |
| `totalPledges`       | Integer | Tổng số pledges                   | `COUNT(*) FROM pledges WHERE campaign_id = X`                                                         |
| `uniqueBackers`      | Integer | Số backer unique                  | `COUNT(DISTINCT user_id) FROM pledges WHERE campaign_id = X`                                          |

---

## Authorization

- Founder chỉ xem được statistics của campaigns mình tạo
- Admin có thể xem tất cả
- Check ownership:
  ```sql
  SELECT * FROM campaigns WHERE id = :campaignId AND user_id = :currentUserId
  ```
- Nếu là Admin request, thêm query param `?fromAdmin=true`

---

## Query Parameters

| Parameter   | Type    | Mô tả                    | Default |
| ----------- | ------- | ------------------------ | ------- |
| `fromAdmin` | Boolean | Request từ admin         | false   |
| `timeRange` | Integer | Số ngày để tính timeline | 30      |

---

## Notes cho Backend Team

### Performance Critical

1. **Pledges Count**: Nên lưu cached count trong campaigns table
2. **Daily Aggregation**: Tính toán timeline nên cache trong bảng riêng
3. **Real-time Updates**: WebSocket để update số liệu real-time

### Indexing Requirements

```sql
CREATE INDEX idx_pledges_campaign_created ON pledges(campaign_id, created_at);
CREATE INDEX idx_pledges_campaign_user ON pledges(campaign_id, user_id);
CREATE INDEX idx_pledges_campaign_status ON pledges(campaign_id, status);
```

### Caching Strategy

- Cache full response trong 1-2 phút
- Invalidate cache khi có pledge mới
- Key: `campaign_stats:{campaignId}`

### Edge Cases

- Campaign chưa có pledge nào: Trả về 0 cho metrics
- daysLeft = 0: Set requiredVelocity = 0
- Division by zero: Luôn check và dùng MAX(1, value)

---

## Example cURL Request

```bash
curl -X GET "https://api.fundelio.com/api/campaigns/camp-123/statistics?timeRange=30" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

---

## Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to view this campaign's statistics"
  }
}
```

---

**Người tạo:** Frontend Team  
**Ngày tạo:** 20/11/2024  
**Version:** 1.0
