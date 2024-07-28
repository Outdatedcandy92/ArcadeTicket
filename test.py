import requests

# Directly use the target URL without the scheme
proxy_url = "https://cors-proxy-gray.vercel.app/"

# Construct the full URL
url = f"{proxy_url}"
headers = {
    "Origin": "outdatedcandy92.github.io",
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
}

# Create a session to manage cookies
session = requests.Session()

try:
    # Make the initial request to get the cookies
    initial_response = session.get(url, headers=headers)

    if initial_response.status_code == 200:
        # Use the session to make the authenticated request
        response = session.get(url, headers=headers)

        if response.status_code == 200:
            html_content = response.text
            # Process the HTML content as needed
            print(html_content)
        else:
            print("Request failed with status code:", response.status_code)
            print(response.headers)
    else:
        print("Initial request failed with status code:", initial_response.status_code)
        print(initial_response.headers)
except requests.exceptions.RequestException as e:
    print("An error occurred:", e)