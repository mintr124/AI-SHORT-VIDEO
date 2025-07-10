def generate_video_with_subtitles(
    scripts,
    output_video_path,
    audio_path="output.mp3",
    output_json_path="segments.json",
    ffmpeg_path=None,
    setting=[],
    font_path="C:\\Windows\\Fonts\\arialbd.ttf",
    video_size=(1440, 1440),
):
    import os
    import whisper
    import json
    import re
    from num2words import num2words
    from difflib import SequenceMatcher
    import numpy as np
    from PIL import Image, ImageDraw, ImageFont
    from moviepy import ImageClip, AudioFileClip, concatenate_videoclips, CompositeAudioClip
    from moviepy.audio.fx import AudioLoop

    # === Thư mục cần căn cứ vào project root: FINAL_EXAM/backend/app ===
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # app/services/ => tuyệt đối
    VOICE_DIR = os.path.join(BASE_DIR, "..", "db", "voices")
    IMAGE_DIR = os.path.join(BASE_DIR, "..", "db", "images")
    SEGMENT_DIR = os.path.join(BASE_DIR, "..", "db", "timestamp")
    VIDEO_DIR = os.path.join(BASE_DIR, "..", "db", "videos")

    audio_path = os.path.join(VOICE_DIR, audio_path)           # app/db/voices/output.mp3
    output_json_path = os.path.join(SEGMENT_DIR, output_json_path)  # segments.json ghi ra đây
    output_video_path = os.path.join(VIDEO_DIR, output_video_path)  # video cũng lưu tại voices/

    # === Chuẩn hóa số thành chữ (nếu có) ===
    def normalize_text(text):
        def replace_number(match):
            try:
                return num2words(int(match.group()), lang='vi')
            except:
                return match.group()
        return re.sub(r'\b\d+\b', replace_number, text).lower()

    # === Đồng bộ phụ đề với scripts ===
    def correct_timestamps(scripts, timestamps):
        corrected = []
        word_index = 0
        full_text = " ".join(scripts)
        correct_words = full_text.strip().split()
        for ts in timestamps:
            normalized_text = normalize_text(ts["text"])
            word_count = len(re.findall(r'\w+', normalized_text))
            segment_words = correct_words[word_index:word_index + word_count]
            ts["text"] = " ".join(segment_words)
            word_index += word_count
            corrected.append(ts)
        return corrected

    def load_timestamps(filename):
        with open(filename, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
        timestamps = []
        for item in raw_data:
            clean_text = " ".join(item["text"].strip().split())
            timestamps.append({
                "start": item["start"],
                "end": item["end"],
                "text": clean_text
            })
        return timestamps

    def similar(a, b):
        return SequenceMatcher(None, a, b).ratio()

    # def group_subtitles_by_scripts(all_subtitles, scripts, threshold=0.6):
    #     subtitles_per_image = []
    #     current_group = []
    #     script_idx = 0
    #     current_script = scripts[script_idx].strip()

    #     for subtitle in all_subtitles:
    #         current_group.append(subtitle)
    #         current_text = ' '.join([s['text'] for s in current_group]).strip()
    #         # So khớp tương đối với ngưỡng
    #         if similar(current_text, current_script) > threshold:
    #             subtitles_per_image.append(current_group)
    #             current_group = []
    #             script_idx += 1
    #             if script_idx < len(scripts):
    #                 current_script = scripts[script_idx].strip()
    #             else:
    #                 break
    #     return subtitles_per_image
    
    def group_subtitles_by_scripts(all_subtitles, scripts, threshold=0.9):
        groups = []
        idx_sub = 0

        for script in scripts:
            group = []
            merged_text = ""
            
            while idx_sub < len(all_subtitles):
                sub = all_subtitles[idx_sub]
                group.append(sub)
                merged_text += " " + sub["text"]
                idx_sub += 1

                # So khớp độ tương đồng
                ratio = SequenceMatcher(None, merged_text.strip(), script.strip()).ratio()
                if ratio >= threshold:
                    break
            
            groups.append(group)

        return groups
    

    # === 1. Dùng Whisper để tạo timestamps từ giọng nói ===
    if ffmpeg_path:
        os.environ["PATH"] += os.pathsep + ffmpeg_path
    print(f"Transcribing audio with Whisper...")
    model = whisper.load_model("base")
    result = model.transcribe(audio_path, language="vi")
    segments = [{
        "start": round(seg["start"], 2),
        "end": round(seg["end"], 2),
        "text": seg["text"]
    } for seg in result["segments"]]

    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(segments, f, ensure_ascii=False, indent=2)

    # === 2. Load timestamps + phân nhóm subtitle ===
    timestamps = load_timestamps(output_json_path)
    timestamps = correct_timestamps(scripts, timestamps)
    print(timestamps)
    print(scripts)
    subtitles_per_image = group_subtitles_by_scripts(timestamps, scripts)
    print(subtitles_per_image)
    images = [os.path.join(IMAGE_DIR, f"image_{i}.png") for i in range(len(scripts))]

    
    def split_text_two_lines(text, max_words=15):
        if not text:
            return []  # Tránh trả về list có phần tử None

        words = text.strip().split()
        if len(words) <= max_words:
            return [text]

        midpoint = len(words) // 2
        line1 = ' '.join(words[:midpoint]).strip()
        line2 = ' '.join(words[midpoint:]).strip()

        return [line for line in [line1, line2] if line]

    # === 3. Vẽ phụ đề lên ảnh ===
    clips = []
    for idx_img, (img_path, subs) in enumerate(zip(images, subtitles_per_image)):
        print(idx_img)
        for sub in subs:
            lines = split_text_two_lines(sub['text'])

            img = Image.open(img_path).convert("RGB").resize(video_size)
            draw = ImageDraw.Draw(img)
            font = ImageFont.truetype(font_path, setting["fontSize"])

            line_spacing = 10
            total_text_height = 0
            line_sizes = []

            # Tính tổng chiều cao của các dòng
            for line in lines:
                if not line:
                    continue  
                bbox = draw.textbbox((0, 0), line, font=font)
                height = bbox[3] - bbox[1]
                total_text_height += height + line_spacing
                line_sizes.append((bbox[2] - bbox[0], height))

            total_text_height -= line_spacing  # bỏ khoảng cách sau dòng cuối

            # Bắt đầu từ vị trí ngay phía trên đáy ảnh
            base_y = video_size[1] - total_text_height - 65
            for i, line in enumerate(lines):
                text_width, text_height = line_sizes[i]
                x = (video_size[0] - text_width) // 2
                y = base_y + i * (text_height + line_spacing)
                # Đổ bóng nếu có
                if setting.get("shadow"):
                    shadow_offset = 2
                    draw.text((x + shadow_offset, y + shadow_offset), line, font=font, fill=setting.get("shadowColor", "#000000"))

                # Vẽ dòng chính
                draw.text((x, y), line, font=font, fill=setting["color"])

            dur = sub['end'] - sub['start']
            clip = ImageClip(np.array(img)).with_duration(dur)
            clips.append(clip)
            
            
    final_video = concatenate_videoclips(clips)

    # === 4. Ghép giọng nói + nhạc nền ===
    voice_audio = AudioFileClip(audio_path)

    if voice_audio.duration > final_video.duration:
        voice_audio = voice_audio.subclipped(0, final_video.duration)


    final_audio = CompositeAudioClip([voice_audio])
    final_video = final_video.with_audio(final_audio)

    # === 5. Xuất video ===
    print("Rendering video...")
    final_video.write_videofile(output_video_path, fps=24)
