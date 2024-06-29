import os
from dotenv import load_dotenv

load_dotenv()

reward_name = input("Enter the reward heading: ")
reward_subname = input("Enter the reward sub-heading: ")
reward_image = input("Enter the reward image: ")
reward_ticket = input("Enter the reward ticket: ")
shop_url = input("Enter the shop URL: ")

# Write the variables to the .env file
with open('.env', 'w') as f:
    f.write(f'REWARD_NAME={reward_name}\n')
    f.write(f'REWARD_SUBNAME={reward_subname}\n')
    f.write(f'REWARD_IMAGE={reward_image}\n')
    f.write(f'REWARD_TICKET={reward_ticket}\n')
    f.write(f'SHOP_URL={shop_url}\n')