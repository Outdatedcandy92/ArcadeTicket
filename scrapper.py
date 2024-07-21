import json

# Step 1: Open and load the JSON data
with open('./public/src/rewards.json', 'r') as file:
    data = json.load(file)

    # Step 2: Print the reward names
    for reward in data:  # Iterate over the list directly
        print(f"<option value='{data.index(reward)}'> {reward['name']}</option>")