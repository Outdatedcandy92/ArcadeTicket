import requests
from bs4 import BeautifulSoup
import re  
import os
from flask import Flask, render_template
from dotenv import load_dotenv

app = Flask(__name__)

url = os.getenv('URL')

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
    number = get_data()
    remaining = 70 - int(number)
    percent = int(number) / 70 * 100

    return render_template('index.html', number=number, remaining=remaining,percent=percent)




app.run(host='0.0.0.0', port=8080)