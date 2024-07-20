import requests
import bs4
import json

url = "https://hackclub.com/arcade/shop/"

# Send a GET request to the URL
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Create a BeautifulSoup object with the HTML content
    soup = bs4.BeautifulSoup(response.text, 'html.parser')

    # Find all elements with class containing 'slackey'
    slackey_elements = soup.find_all(class_='slackey')
    # Find all elements with class containing 'css-50nlwd'
    tick = soup.find_all(class_='css-50nlwd')

    img = soup.find_all(class_='css-hso7i9')

    # Print the text content of each 'slackey' element

    slacky = []
    tickets = []
    images = []

    for index, element in enumerate(slackey_elements):
        if index % 2 == 0:
            print(element.text)
            slacky.append(element.text)

    for index, element in enumerate(tick):
        cleaned_text = element.text.replace("🎟️", "")  # Remove the emoji
        print(cleaned_text)
        tickets.append(cleaned_text)

    for index, element in enumerate(img):
        print(element.get('src'))
        images.append(element.get('src'))
    


    rewards = []

    min_length = min(len(slacky), len(tickets), len(images))

    for i in range(min_length):
        reward = {
            "REWARD_NAME": slacky[i+1],
            "REWARD_TICKET": tickets[i],
            "REWARD_IMAGE": images[i]
        }
        rewards.append(reward)

    # Write the list of dictionaries to a JSON file
    with open('rewards.json', 'w') as json_file:
        json.dump(rewards, json_file, indent=4)
       
else:
    print("Failed to retrieve the page.")