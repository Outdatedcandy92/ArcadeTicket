import requests

url = "https://cors-proxy-inky.vercel.app/hackhour.hackclub.com/api/history/U079HV9PTC7"
headers = {
    "Authorization": "Bearer 5ee2ee3e-b72f-41e2-a038-0c06ffec0cf2",
    "Origin": "outdatedcandy92.github.io"
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    data = response.json()
    # Process the data as needed
    print(data)
else:
    print("Request failed with status code:", response.status_code)
