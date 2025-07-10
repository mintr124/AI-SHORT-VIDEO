from deep_translator import GoogleTranslator

def translate_vi_to_en(text_vi):
    try:
        translator = GoogleTranslator(source='vi', target='en')
        translated = translator.translate(text_vi)
        return translated
    except Exception as e:
        return f"Error: {e}"

