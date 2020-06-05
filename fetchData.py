import requests

key = "null"
url = "https://api.usa.gov/crime/fbi/sapi/api/agencies/list?API_KEY="

r = requests.get(url+key)
with open("./agencyList", "w") as f:
    f.write(r.text)
