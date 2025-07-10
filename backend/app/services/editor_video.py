import tempfile
from io import BytesIO
import numpy as np
import requests
from PIL import Image, ImageDraw, ImageFont

from moviepy import VideoFileClip, CompositeVideoClip, ImageClip


def process_video(video_file, actions):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        video_file.save(tmp.name)
        clip = VideoFileClip(tmp.name)
        overlays = []

        for a in actions:
            if a['type'] == 'text':
                # Create transparent image with text using PIL
                img = Image.new("RGBA", (1280, 720), (0, 0, 0, 0))
                draw = ImageDraw.Draw(img)

                try:
                    font = ImageFont.truetype("arial.ttf", int(a['fontSize']))
                except IOError:
                    font = ImageFont.load_default()

                text = a['text']
                bbox = draw.textbbox((0, 0), text, font=font)
                text_width = bbox[2] - bbox[0]
                text_height = bbox[3] - bbox[1]
                x = a['x']
                y = a['y']

                draw.text((x, y), text, font=font, fill="white")

                np_img = np.array(img)
                txt_clip = ImageClip(np_img, transparent=True).with_duration(
                    a['end'] - a['start']
                ).with_start(a['start']).with_position((x, y))

                overlays.append(txt_clip)

            elif a['type'] == 'image':
                img_data = requests.get(a['url']).content
                img = Image.open(BytesIO(img_data)).convert("RGBA")
                np_img = np.array(img)
                img_clip = ImageClip(np_img, transparent=True).set_duration(
                    a['end'] - a['start']
                ).set_start(a['start']).set_position((a['x'], a['y']))
                overlays.append(img_clip)

        final = CompositeVideoClip([clip] + overlays)
        out_path = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4").name
        final.write_videofile(out_path, codec="libx264", audio_codec="aac", preset='ultrafast', threads=4)

        return out_path
