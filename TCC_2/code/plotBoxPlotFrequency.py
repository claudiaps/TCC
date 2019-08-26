import json
import plotly.graph_objects as go

with open('./boxplotFrequency.json') as f:
    data = json.load(f)
fig = go.Figure()
fig.add_trace(go.Box(y=data, name='frequency'))

fig.show()

