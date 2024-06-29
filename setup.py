from dotenv import load_dotenv
import validators

load_dotenv()

reward_name = input("Enter the reward heading: ")
reward_subname = input("Enter the reward sub-heading: ")
reward_ticket = input("Enter the reward ticket: ")
while True:
    reward_image = input("Enter the reward image URL: ")
    if validators.url(reward_image):
        break
    else:
        print("The URL entered is not valid. Please enter a valid URL.")

while True:
    shop_url = input("Enter the shop URL: ")
    if validators.url(shop_url) :
        break
    else:
        print("The URL entered is not valid. Please enter a valid URL.")

# Write the variables to the .env file
with open('.env', 'w') as f:
    f.write(f'REWARD_NAME={reward_name}\n')
    f.write(f'REWARD_SUBNAME={reward_subname}\n')
    f.write(f'REWARD_IMAGE={reward_image}\n')
    f.write(f'REWARD_TICKET={reward_ticket}\n')
    f.write(f'SHOP_URL={shop_url}\n')