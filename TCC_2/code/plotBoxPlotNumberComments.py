import json
import plotly.graph_objects as go

with open('../data/boxplotNumberComments.json') as f:
    data = json.load(f)
fig = go.Figure()
fig.add_trace(go.Box(y=data, name='comments'))

fig.show()

