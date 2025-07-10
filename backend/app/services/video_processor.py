from moviepy import ImageClip, AudioFileClip, concatenate_videoclips, CompositeAudioClip
from moviepy.audio.fx import AudioLoop
from moviepy.audio.fx import MultiplyVolume
from PIL import Image, ImageDraw, ImageFont
import os

images = [f"img{i}.jpg" for i in range(1, 4)]
scripts = [
    "This is a subtitle for scene 1, it's just for testing!",
    "This is a subtitle for scene 2, another testing text.",
    "This is a subtitle for scene 3, final testing line."
]


video_size = (1440, 1440)
font_path = "C:\\Windows\\Fonts\\arial.ttf"
voice_audio = AudioFileClip("subtitled.mp3")
voice_audio = voice_audio.with_speed_scaled(1.2)
duration = voice_audio.duration

word_counts = [len(text.split()) for text in scripts]
total_words = sum(word_counts)
durations = [(count / total_words) * duration for count in word_counts]

output_folder = "labeled_images"
os.makedirs(output_folder, exist_ok=True)

clips = []

for idx, (img_path, text) in enumerate(zip(images, scripts)):
    img = Image.open(img_path).convert("RGB")
    img = img.resize(video_size)

    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype(font_path, 40)
    except:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (video_size[0] - text_width) // 2
    y = video_size[1] - text_height - 70

    draw.text((x, y), text, font=font, fill="black")

    labeled_path = os.path.join(output_folder, f"labeled_{idx}.jpg")
    img.save(labeled_path)

    clip = ImageClip(labeled_path).with_duration(durations[idx])
    clips.append(clip)

# Nối video lại
final_video = concatenate_videoclips(clips)

# Thêm nhạc nền
background_audio = AudioFileClip("background.mp3")
background_audio = background_audio.with_volume_scaled(0.2)
voice_audio = voice_audio.with_volume_scaled(2)


video_duration = final_video.duration
if background_audio.duration < video_duration:
    background_audio = AudioLoop(background_audio, duration=video_duration)
else:
    background_audio = background_audio.subclipped(0, video_duration)

if voice_audio.duration > video_duration:
    voice_audio = voice_audio.subclipped(0, video_duration)
else:
    pass

final_audio = CompositeAudioClip([background_audio, voice_audio])

# Gán âm thanh vào video
final_video = final_video.with_audio(final_audio)

# Xuất video
final_video.write_videofile("video_with_subtitles.mp4", fps=24)
