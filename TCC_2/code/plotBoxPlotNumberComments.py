import json
import plotly.graph_objects as go
from outliers import smirnov_grubbs as grubbs

with open('../data/boxplotNumberComments.json') as f:
    data = json.load(f)
fig = go.Figure()
fig.add_trace(go.Box(y=grubbs.test(data, alpha=0.20), name='comments'))
fig.show()

