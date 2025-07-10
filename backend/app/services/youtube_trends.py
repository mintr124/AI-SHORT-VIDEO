import requests

def get_youtube_suggestions(keyword):
    url = f"https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q={keyword}"
    response = requests.get(url)
    suggestions = response.json()[1]
    return suggestions
