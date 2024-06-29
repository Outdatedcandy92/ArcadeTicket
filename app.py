import requests
from bs4 import BeautifulSoup
import re  
import os
from flask import Flask, request, redirect, url_for, render_template

from dotenv import load_dotenv

app = Flask(__name__)

url = os.getenv('URL')

Reward_Name = 'Set Name'
Ticket_Number = 'set number'
Image_Url = 'set url'

def get_data():
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    element = soup.find(class_='gaegu css-4j6pzy')
    if element:
        # Use regular expression to find all numbers in the element's text
        numbers = re.findall(r'\d+', element.text)
        if numbers:  # Check if any number was found
            print(numbers[0])  # Print the first number found
            return numbers[0]
        else:
            print("No number found in the element.")
    else:
        print("Element not found.")

@app.route('/')
def home():
    number = get_data()  # Assuming get_data() is defined elsewhere
    remaining = 70 - int(number)
    percent = int(number) / 70 * 100

    return render_template('index.html', number=number, remaining=remaining, percent=percent)

@app.route('/set', methods=['POST'])
def set():
    # Example of processing form data
    shop_url = request.form['shopurl']
    reward_name = request.form['rewardname']
    ticket_number = request.form['rewardticket']
    image_url = request.form['rewardimage']
    # Process the data as needed...

    # Redirect back to the home page
    return redirect(url_for('home'))


app.run(host='0.0.0.0', port=8080)