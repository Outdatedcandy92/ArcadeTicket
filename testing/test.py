import json

# Open the data.json file
with open('data.json') as file:
    # Read the contents of the file
    data = json.load(file)

# Modify the 'createdAt' values to only include the date part (yyyy-mm-dd)
for item in data['data']:
    item['createdAt'] = item['createdAt'].split('T')[0]  # Using split method

# Initialize a dictionary to hold the sum of 'elapsed' times for each date
elapsed_sum_by_date = {}

# Accumulate the 'elapsed' times for each date
for item in data['data']:
    date = item['createdAt']
    elapsed = item['elapsed']
    if date in elapsed_sum_by_date:
        elapsed_sum_by_date[date] += elapsed
    else:
        elapsed_sum_by_date[date] = elapsed

# Convert the elapsed time from minutes to hours and print the result
for date, total_minutes in elapsed_sum_by_date.items():
    total_hours = total_minutes / 60  # Convert minutes to hours
    print(f"{date}: {total_hours} hours that day")


import matplotlib.pyplot as plt
import datetime

# Assuming elapsed_sum_by_date is already populated
dates = list(elapsed_sum_by_date.keys())
total_hours = [minutes / 60 for minutes in elapsed_sum_by_date.values()]

# Convert dates to "Month Day" format
formatted_dates = [datetime.datetime.strptime(date, "%Y-%m-%d").strftime("%B %d").replace(' 0', ' ') + 'th' for date in dates]
# Handle special cases for 1st, 2nd, and 3rd
formatted_dates = [date[:-2] + 'st' if date.endswith('1th') else date for date in formatted_dates]
formatted_dates = [date[:-2] + 'nd' if date.endswith('2th') else date for date in formatted_dates]
formatted_dates = [date[:-2] + 'rd' if date.endswith('3th') else date for date in formatted_dates]

# Calculate the average hours per day
average_hours_per_day = sum(total_hours) / len(total_hours)

# Plotting
# Plotting
plt.figure(figsize=(10, 6))  # Set the figure size
plt.bar(formatted_dates, total_hours, label='Total Hours')  # Plot the total hours data as a bar graph
plt.axhline(y=average_hours_per_day, color='r', linestyle='-', label='Average Hours')  # Add average line
plt.title('Total and Average Elapsed Hours by Date')  # Title of the plot
plt.xlabel('Date')  # X-axis label
plt.ylabel('Elapsed Hours')  # Y-axis label
plt.xticks(ticks=plt.xticks()[0], labels=formatted_dates, fontsize=9, rotation=45, ha='right')  # Adjust x-ticks alignment
plt.legend()  # Show legend
plt.tight_layout()  # Adjust the layout to make room for the rotated x-axis labels
plt.savefig('output.png')  # Save the plot as a PNG file
plt.show()  # Display the plot
