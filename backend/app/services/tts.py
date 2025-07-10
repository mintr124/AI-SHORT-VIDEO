import os
import edge_tts

VOICE_MAP = {
    "male": "vi-VN-NamMinhNeural",
    "female": "vi-VN-HoaiMyNeural"
}

async def text_to_speech_vietnamese(
    text: str,
    gender: str = "female",
    rate: str = "+0%",
    volume: str = "+0%",
    pitch: str = "+0Hz",
    filename: str = "output.mp3"
):
    voice = VOICE_MAP.get(gender.lower(), "vi-VN-HoaiMyNeural")

    # Tính đường dẫn tuyệt đối đến folder db/
    current_dir = os.path.dirname(__file__)                  # app/services
    db_dir = os.path.abspath(os.path.join(current_dir, "..", "db", "voices"))  # app/db/voices
    os.makedirs(db_dir, exist_ok=True)
    output_path = os.path.join(db_dir, filename)

    communicate = edge_tts.Communicate(
        text=text,
        voice=voice,
        rate=rate,
        volume=volume,
        pitch=pitch
    )
    await communicate.save(output_path)
    print(f"✅ Giọng đọc đã lưu tại: {output_path}")
    return output_path
