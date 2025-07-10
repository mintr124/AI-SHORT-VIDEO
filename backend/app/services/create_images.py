import requests
import os
from services.translate_text import translate_vi_to_en 

def generate_image(prompt: str, output_path: str = "output.png"):
    url = f"https://image.pollinations.ai/prompt/{prompt}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        with open(output_path, "wb") as f:
            f.write(response.content)
        print(f"Image saved at: {output_path}")
    except requests.exceptions.RequestException as e:
        print(f"Error calling API: {e}")
        
def get_prompt_style(label):
    if label == "Mặc định":
        return ""
    parts = label.split(":")
    if len(parts) < 2:
        return ""
    style = parts[1].strip()
    if not style.lower().endswith("style"):
        style += " style"

    return style

def create_img_for_video(scripts_list, type):
    current_dir = os.path.dirname(__file__)
    db_images = os.path.abspath(os.path.join(current_dir, "..", "db", "images"))

    # ✅ Xóa các ảnh trong thư mục nhưng giữ thư mục
    if os.path.exists(db_images):
        for filename in os.listdir(db_images):
            file_path = os.path.join(db_images, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)

    os.makedirs(db_images, exist_ok=True)  # Đảm bảo thư mục tồn tại

    style = get_prompt_style(type)

    for i, script in enumerate(scripts_list):
        context = translate_vi_to_en(script) + " " + style
        print(context)
        output_path = os.path.join(db_images, f"image_{i}.png")
        generate_image(context, output_path)
        
def create_single_img(script, fileName, type):
    current_dir = os.path.dirname(__file__)
    db_images = os.path.abspath(os.path.join(current_dir, "..", "db", "images"))
    output_path = os.path.join(db_images, fileName)
    style = get_prompt_style(type)
    context = translate_vi_to_en(script) + " " + style
    generate_image(context, output_path)
