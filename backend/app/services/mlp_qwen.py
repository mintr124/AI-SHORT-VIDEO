import re
from together import Together

def generate_script(prompt: str) -> str:
    client = Together(api_key="tgp_v1_d0w2MgUxOUiRCFvuVdQC7yG1epMk5-H4lr3Jb99tngc")

    response = client.chat.completions.create(
        model="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
        messages=[
        {
            "role": "user",
            "content": prompt

        }
        ]
    )
    return re.sub(r"\s*<think>.*?</think>\s*", "", response.choices[0].message.content, flags=re.DOTALL)
    


