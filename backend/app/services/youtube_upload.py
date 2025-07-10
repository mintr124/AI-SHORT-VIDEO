import requests

YOUTUBE_UPLOAD_URL = "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status"

def upload_to_youtube(access_token, metadata_json, video_file):
    try:
        # Đọc nội dung video file và metadata
        metadata_blob = ("metadata.json", metadata_json, "application/json")
        video_blob = (video_file.filename, video_file.read(), video_file.mimetype)

        files = {
            "metadata": metadata_blob,
            "video": video_blob,
        }

        headers = {
            "Authorization": f"Bearer {access_token}",
        }

        response = requests.post(
            YOUTUBE_UPLOAD_URL,
            headers=headers,
            files=files,
        )

        # ✅ Trường hợp thành công
        if response.status_code in [200, 201]:
            data = response.json()
            video_id = data.get("id")
            return True, f"https://youtu.be/{video_id}" if video_id else None

        # ❌ Trường hợp lỗi từ Google API
        try:
            error_info = response.json()
        except Exception:
            error_info = response.text  # fallback nếu JSON lỗi

        return False, {
            "status_code": response.status_code,
            "error": error_info,
        }

    except Exception as e:
        # ❌ Lỗi không mong muốn (network, exception...)
        return False, {"exception": str(e)}
