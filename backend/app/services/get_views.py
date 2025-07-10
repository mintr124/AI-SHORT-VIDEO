import random
from datetime import datetime, timedelta

def generate_distributed_views(total, points):
    if points == 0:
        return []

    base = total // points
    remaining = total - base * points
    views = [base] * points

    for _ in range(remaining):
        index = random.randint(0, points - 1)
        views[index] += 1

    # Ngẫu nhiên hóa nhẹ mà không cho phần tử nào âm
    for i in range(points):
        change = random.randint(-2, 2)
        if views[i] + change >= 0:
            views[i] += change

    # Điều chỉnh tổng lại chính xác bằng total
    diff = total - sum(views)
    if diff != 0:
        # Phân bổ lại phần chênh lệch cho các phần tử lớn hơn 0
        for i in range(points):
            if diff == 0:
                break
            if diff > 0:
                views[i] += 1
                diff -= 1
            elif views[i] > 0:
                views[i] -= 1
                diff += 1

    return views


def get_analytics_data(days: int, videos: list):
    now = datetime.now()
    sliced_data = []
    n_points = 24 if days == 1 else days

    date_list = [
        (now - timedelta(hours=(n_points - 1 - i))).strftime("%H:00") if days == 1
        else (now - timedelta(days=(n_points - 1 - i))).strftime("%Y-%m-%d")
        for i in range(n_points)
    ]

    # Chuẩn bị dữ liệu phân bố
    distributed_views = {}

    for video in videos:
        name = video["name"]
        total_views = video.get("views", 0)

        created_date = datetime.strptime(video["created"], "%Y-%m-%dT%H:%M:%SZ")
        created_index = 0
        for i, d in enumerate(date_list):
            compare_date = (
                datetime.strptime(d, "%H:00").replace(
                    year=now.year, month=now.month, day=now.day
                ) if days == 1 else datetime.strptime(d, "%Y-%m-%d")
            )
            if compare_date >= created_date:
                created_index = i
                break
        # Tính số ngày hợp lệ từ ngày ra mắt đến hiện tại
        valid_range = n_points - created_index
        if valid_range <= 0:
            distributed_views[name] = [0] * n_points
        else:
            partial_views = generate_distributed_views(total_views, valid_range)
            distributed_views[name] = [0] * created_index + partial_views

    # Ghép dữ liệu
    for i in range(n_points):
        item = {"time" if days == 1 else "date": date_list[i]}
        for video in videos:
            name = video["name"]
            item[name] = distributed_views[name][i]
        sliced_data.append(item)

    return sliced_data
