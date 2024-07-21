import json

# Step 1: Open and load the JSON data
with open('rewards.json', 'r') as file:
    data = json.load(file)

# Step 2: Sort the data based on the 'hours' field in ascending order
sorted_data = sorted(data, key=lambda x: x['hours'])

# Step 3: Write the sorted data back to 'reward.json'
with open('reward.json', 'w') as file:
    json.dump(sorted_data, file, indent=4)