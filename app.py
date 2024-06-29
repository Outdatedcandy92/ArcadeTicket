import requests
from bs4 import BeautifulSoup
import re  
import os
from flask import Flask, request, redirect, url_for, render_template

from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()
shop_url = os.getenv('SHOP_URL')
reward_name = os.getenv('REWARD_NAME')
reward_subname = os.getenv('REWARD_SUBNAME')
image = os.getenv('REWARD_IMAGE')
reward_ticket = os.getenv('REWARD_TICKET')


print(shop_url, reward_name, reward_subname, image, reward_ticket)
def get_data():
    response = requests.get(shop_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    element = soup.find(class_='gaegu css-4j6pzy')
    if element:
        # Use regular expression to find all numbers in the element's text
        numbers = re.findall(r'\d+', element.text)
        if numbers:  # Check if any number was found
            print(numbers[0])  # Print the first number found
            return int(numbers[0])
        else:
            print("No number found in the element.")
    else:
        print("Element not found.")

def rem_tickets(number):
    if int(reward_ticket) <= int(number):
        return "You have enough tickets to redeem the reward🎉"
    else:
        return f"You need {int(reward_ticket) - int(number)} more tickets to redeem the reward"

def percentage(number):
    per = (int(number)/int(reward_ticket))*100
    if per >= 100:
        return 100
    else:
        return per

@app.route('/')
def home():
    number = get_data() 
    remaining=rem_tickets(number)  
    percent =  percentage(number)
    reward_image = image
    return render_template('index.html', number=number, remaining=remaining, percent=percent, reward_name=reward_name, reward_subname=reward_subname, reward_image=reward_image, reward_ticket=reward_ticket)



app.run(host='0.0.0.0', port=8080, debug=True)