import json
with open('./agencyList.json') as f:
    data = json.load(f)

def sortlat(elem):
    if elem['latitude'] is None:
        return 0
    else:
        return elem['latitude']

def sortlng(elem):
    if elem['longitude'] is None:
        return 0
    else:
        return elem['longitude']

data.sort(key=sortlat)
with open('./agencyLat.json', 'w') as f:
    f.write(json.dumps(data))

data.sort(key=sortlng)
with open('./agencyLng.json', 'w') as f:
    f.write(json.dumps(data))
