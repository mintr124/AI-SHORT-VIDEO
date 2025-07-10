import asyncio
import os
import threading
import json
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from services.mlp_qwen import generate_script
from services.youtube_trends import get_youtube_suggestions
from services.google_trends import get_google_suggestions
from services.tts import text_to_speech_vietnamese
from services.create_images import create_img_for_video,create_single_img
from services.handle_voice import generate_video_with_subtitles
from services.youtube_video import get_youtube_channel_and_video_stats
from services.get_views import get_analytics_data
from services.youtube_upload import upload_to_youtube

app = Flask(__name__)
CORS(app)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'db', 'workspace', 'video_data.json')

# AI Script Generation
@app.route("/api/ai", methods=["POST"])
def generate():
    data = request.get_json()
    prompt = data.get("prompt", "")
    print("Prompt received (AI):", prompt)
    results = generate_script(prompt)
    print("Generated script:", results)
    return jsonify({"results": results})


# YouTube Trend Suggestions
@app.route("/api/youtube", methods=["POST"])
def youtube_trends():
    data = request.get_json()
    prompt = data.get("prompt", "")
    print("Prompt received (YouTube):", prompt)
    results = get_youtube_suggestions(prompt)
    return jsonify({"results": results})


# Google Trend Suggestions
@app.route("/api/google", methods=["POST"])
def google_trends():
    data = request.get_json()
    prompt = data.get("prompt", "")
    print("Prompt received (Google):", prompt)
    results = get_google_suggestions(prompt)
    return jsonify({"results": results})


@app.route("/api/tts", methods=["POST"])
def generate_tts():
    data = request.get_json()
    text = data.get("text", "")
    gender = data.get("gender", "male")
    rate = data.get("rate", "+0%")
    volume = data.get("volume", "+0%")
    pitch = data.get("pitch", "+0Hz")
    # print(text)
    output_path = asyncio.run(
        text_to_speech_vietnamese(text=text, gender=gender, rate=rate, volume=volume, pitch=pitch)
    )
    url_audio = "http://127.0.0.1:5000/audio/output.mp3"
    return jsonify({"status": "ok", "url": url_audio})


@app.route("/audio/<filename>")
def serve_audio(filename):
    return send_from_directory("db/voices", filename)

@app.route("/image/<filename>")
def serve_image(filename):
    return send_from_directory("db/images", filename)

@app.route("/api/get_images")
def list_images():
    files = os.listdir("db/images")
    image_files = [f for f in files if f.lower().endswith((".png", ".jpg", ".jpeg", ".gif"))]
    return jsonify({"images": image_files})

@app.route("/api/images", methods=["POST"])
def images_for_clip():
    data = request.get_json()
    scripts = data.get("list", [])
    type = data.get("type", "Mặc định")
    def run_image_creation():
        create_img_for_video(scripts, type)
        print("Images saved at db/images!")
    threading.Thread(target=run_image_creation).start()
    return jsonify({"status": "ok"})

@app.route("/api/image_count", methods=["GET"])
def get_image_count():
    image_folder = os.path.join(os.path.dirname(__file__), "db", "images")
    count = len([f for f in os.listdir(image_folder) if f.endswith(".png")])
    return jsonify({"count": count})

current_dir = os.path.dirname(__file__)                  # app
db_dir = os.path.abspath(os.path.join(current_dir, "db", "voices"))  # app/db/voices
os.makedirs(db_dir, exist_ok=True)
@app.route("/api/upload", methods=["POST"])
def upload_background():
    if "file" not in request.files:
        return jsonify({"error": "No file"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Noname file"}), 400
    save_path = os.path.join(db_dir, file.filename)
    file.save(save_path)
    return jsonify({"message": "Upload succesfully", "filename": file.filename})

@app.route("/api/generate_video", methods=["POST"])
def generate_video():
    print("Generating video now...")
    data = request.get_json()
    scripts = data.get("scripts", [])
    print(scripts)
    print(len(scripts))
    filename = data.get("filename", "video.mp4")
    setting = data.get("settingSubtitle", [])
    generate_video_with_subtitles(scripts=scripts, output_video_path=filename, setting=setting, ffmpeg_path=r"D:\Documents!\items\ffmpeg\ffmpeg-7.0.2-full_build\bin")
    return jsonify({"results": "OK"})

@app.route('/api/upload_image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'Không có file "image"'}), 400
    file = request.files['image']
    filepath = os.path.join("db/images", file.filename)
    file.save(filepath)
    return jsonify({'message': 'Ảnh đã được lưu', 'path': filepath})

@app.route('/api/regenerate_image', methods=['POST'])
def regenerate_image():
    data = request.get_json()
    script = data.get("script", "")
    filename = data.get("filename", "")
    type = data.get("type", "Mặc định")
    create_single_img(script, filename, type)
    return jsonify({'message': 'Ảnh đã được lưu'})

def read_data():
    if not os.path.exists(DATA_FILE):
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        init_data = {"workspace": [], "youtube": []}
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(init_data, f, ensure_ascii=False, indent=2)
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def write_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@app.route('/api/workspaces', methods=['POST'])
def add_workspace():
    try:
        new_workspace = request.get_json()
        data = read_data()
        data.setdefault("workspace", [])
        data["workspace"].append(new_workspace)
        write_data(data)
        return jsonify({'message': 'Workspace đã được thêm thành công'}), 201
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 500
    
def add_item_to_workspace(data, workspace_name, new_item):
    for ws in data["workspace"]:
        if ws["name"] == workspace_name:
            ws["items"].append(new_item)
            ws["totalVideo"] = len(ws["items"])
            return True
    return False
    
@app.route('/api/workspaces/item', methods=['POST'])
def add_workspace_item():
    try:
        info = request.get_json()
        item = info.get("item", {})
        workspace = info.get("workspace", "")
        print(item)
        print(workspace)
        data = read_data()
        success = add_item_to_workspace(data, workspace, item)
        if success:
            print("OK!")
            print(data)
            write_data(data)
        else:
            print("Không tìm thấy workspace")
        return jsonify({'message': 'Item đã được thêm thành công'}), 201
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 500
    
@app.route("/videos/<filename>")
def serve_video(filename):
    return send_from_directory("db/videos", filename)

@app.route('/api/get_youtube', methods=['POST'])
def regenerate_youtube():
    data = request.get_json()
    handle = data.get('handle', 'tranminh7223')
    result = get_youtube_channel_and_video_stats(handle)
    return jsonify(result)

@app.route('/api/analysis', methods=['POST'])
def get_views_youtube():
    data = request.get_json()
    video_data = data.get('data', [])
    count = data.get('count', 1)
    result = get_analytics_data(count, video_data)
    return jsonify(result)

@app.route('/api/export', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    video = request.files['video']
    save_path = os.path.join(os.path.join(BASE_DIR, 'db', 'videos'), video.filename+".mp4")
    video.save(save_path)
    return jsonify({"message": "Video uploaded successfully", "path": save_path})

@app.route("/api/upload-video", methods=["POST"])
def handle_upload():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return jsonify({"error": "Thiếu hoặc sai định dạng Authorization header"}), 400
    access_token = auth_header.split(" ")[1]
    metadata_raw = request.form.get("metadata")
    video_file = request.files.get("video")
    if not metadata_raw or not video_file:
        return jsonify({"error": "Thiếu metadata hoặc video"}), 400
    success, result = upload_to_youtube(access_token, metadata_raw, video_file) 
    if success:
        return jsonify({"success": True, "youtube_url": result})
    else:
        return jsonify({"success": False, "error": result}), 500



if __name__ == "__main__":
    app.run(port=5000)
