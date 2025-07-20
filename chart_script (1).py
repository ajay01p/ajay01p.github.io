import plotly.graph_objects as go
import plotly.io as pio

# Data for the chart
projects_data = {
    "projects": [
        {"name": "Student Management System", "complexity": 95, "technologies": "Python, SQLite, Tkinter, GUI"}, 
        {"name": "ML Price Predictor", "complexity": 90, "technologies": "Python, Flask, Scikit-learn, ML"}, 
        {"name": "Personal Portfolio", "complexity": 85, "technologies": "HTML, CSS, JavaScript, Animations"}, 
        {"name": "Weather Forecast App", "complexity": 75, "technologies": "JavaScript, API, Responsive Design"}
    ]
}

# Extract data for plotting
project_names = [project["name"] for project in projects_data["projects"]]
complexity_levels = [project["complexity"] for project in projects_data["projects"]]

# Shorten project names to fit 15 character limit
shortened_names = [
    "Student Mgmt",
    "ML Predictor", 
    "Portfolio",
    "Weather App"
]

# Brand colors (first 4)
colors = ['#1FB8CD', '#FFC185', '#ECEBD5', '#5D878F']

# Create bar chart
fig = go.Figure(data=[
    go.Bar(
        x=shortened_names,
        y=complexity_levels,
        marker=dict(color=colors),
        hovertemplate='<b>%{x}</b><br>Complexity: %{y}%<extra></extra>',
        cliponaxis=False
    )
])

# Update layout
fig.update_layout(
    title="Project Complexity Analysis",
    xaxis_title="Projects",
    yaxis_title="Complexity %",
    yaxis=dict(range=[0, 100]),
    showlegend=False
)

# Save the chart
fig.write_image("portfolio_complexity_chart.png")