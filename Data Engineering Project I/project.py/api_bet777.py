import requests
import json

# URL van de API
url = "https://api.sportify.bet/echo/v1/events"

# Query parameters
params = {
    "sport": "voetbal",
    "competition": "belgium-first-division-a",
    "_cached": "true",
    "key": "market_type",
    "lang": "nl",
    "bookmaker": "bet777"
}

# Een GET-verzoek maken naar de API met de opgegeven URL en parameters
response = requests.get(url, params=params)

# Controleren of het verzoek succesvol was (statuscode 200)
if response.status_code == 200:
    data = response.json()
    output_file = "response_data.json"
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=4)

