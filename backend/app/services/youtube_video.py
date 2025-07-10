from googleapiclient.discovery import build

API_KEY = 'AIzaSyD4Z4Jd868Isq0H0a4RBYsmRgT7kmJoDaA'  # 🔒 Thay bằng API key của bạn

def get_youtube_channel_and_video_stats(handle):
    youtube = build('youtube', 'v3', developerKey=API_KEY)

    # 🔍 Tìm channel ID từ handle
    res = youtube.search().list(
        part='snippet',
        q=f'@{handle}',
        type='channel',
        maxResults=1
    ).execute()
    if not res['items']:
        print("❌ Không tìm thấy channel từ handle.")
        return {'videos': [], 'subscriberCount': None}

    channel_id = res['items'][0]['snippet']['channelId']

    # 👤 Lấy số lượng subscriber
    channel_data = youtube.channels().list(
        part='statistics,contentDetails',
        id=channel_id
    ).execute()
    if not channel_data['items']:
        return {'videos': [], 'subscriberCount': None}

    statistics = channel_data['items'][0]['statistics']
    uploads_id = channel_data['items'][0]['contentDetails']['relatedPlaylists']['uploads']
    subscriber_count = statistics.get('subscriberCount', '0')

    # 📺 Lấy tất cả video ID từ playlist
    video_ids = []
    next_page_token = None
    while True:
        res = youtube.playlistItems().list(
            part='contentDetails',
            playlistId=uploads_id,
            maxResults=50,
            pageToken=next_page_token
        ).execute()
        video_ids += [item['contentDetails']['videoId'] for item in res['items']]
        next_page_token = res.get('nextPageToken')
        if not next_page_token:
            break

    # 📊 Lấy thống kê video
    stats = []
    for i in range(0, len(video_ids), 50):
        res = youtube.videos().list(
            part='statistics,snippet',
            id=','.join(video_ids[i:i+50])
        ).execute()
        for item in res['items']:
            snippet = item['snippet']
            stats.append({
                'title': snippet['title'],
                'views': item['statistics'].get('viewCount', '0'),
                'likes': item['statistics'].get('likeCount', '0'),
                'comments': item['statistics'].get('commentCount', '0'),
                'publishedAt': snippet.get('publishedAt', ''),
                'url': f"https://www.youtube.com/watch?v={item['id']}" ,
                'thumbnail': snippet['thumbnails'].get('maxres', snippet['thumbnails'].get('high', snippet['thumbnails'].get('default', {}))).get('url', '')
            })

    return {
        'subscriberCount': subscriber_count,
        'videos': stats
    }
