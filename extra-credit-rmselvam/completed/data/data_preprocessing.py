import pandas as pd

# Load the Superstore dataset
data = pd.read_csv("train.csv")

# Convert 'Order Date' to datetime
data['Order Date'] = pd.to_datetime(data['Order Date'], errors='coerce')

# Check for rows where conversion failed
invalid_dates = data[data['Order Date'].isna()]
print("Invalid date entries:")
print(invalid_dates)
# Drop the invalid rows (5841 rows)
data = data.dropna(subset=['Order Date'])


# Extract month-year for grouping
data['Month'] = data['Order Date'].dt.to_period('M').astype(str)

# Group data for the bar chart (total sales by category)
bar_chart_data = data.groupby('Category')['Sales'].sum().reset_index()
bar_chart_data.columns = ['Category', 'Sales']

# Group data for the line chart (monthly sales by category)
line_chart_data = data.groupby(['Category', 'Month'])['Sales'].sum().reset_index()
line_chart_data.columns = ['Category', 'Month', 'Sales']

# Save the cleaned datasets
bar_chart_data.to_csv("bar_chart_data.csv", index=False)
line_chart_data.to_csv("line_chart_data.csv", index=False)
