import requests
import json

def get_google_suggestions(keyword):
    url = "http://suggestqueries.google.com/complete/search"
    params = {
        "client": "firefox",
        "q": keyword,
        "hl": "vi"  
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        suggestions = response.json()[1]
        return suggestions
    else:
        return []