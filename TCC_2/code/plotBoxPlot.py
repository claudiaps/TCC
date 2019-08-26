import json
import plotly.graph_objects as go
from outliers import smirnov_grubbs as grubbs

with open('./boxplot.json') as f:
    data = json.load(f)
fig = go.Figure()
for row in data:
    print(row)
    fig.add_trace(go.Box(y=grubbs.test(row['y'], alpha=0.8), name=row['name']))

fig.show()

