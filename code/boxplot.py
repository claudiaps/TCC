import plotly.graph_objects as go
import csv
import numpy as np 

file_csv =  open('../data/csv_label_data.csv', 'r')
readCSV = csv.reader(file_csv)

# fig = px.box(readCSV, x="name", y="qtd")
# fig.show()

fig = go.Figure()
for row in readCSV:
    if(row[0] == "name"):
        pass    
    fig.add_trace(go.Box(y=row[1], name=row[0]))

fig.show()