import json
import csv
import plotly.graph_objects as go

def print_boxplot (data):
    fig = go.Figure()
    for row in data:
        fig.add_trace(go.Box(y=row['qtd'], name=row['name']))

    fig.show()

def open_file():
    f = open('../data/csv_label_data.csv')
    csv_f = csv.reader(f)
    return csv_f

def get_sheet():
    csv_f = open_file()
    array_labels = []
    for row in csv_f:
        if(row[0] not in array_labels and row[0] != "name"):
            array_labels.append(row[0])

    csv = open_file()

    data_array = []
    label_counter = 0
    qtd = []

    for r in csv:
        label = {}
        if(r[0] == 'name'):
            pass
        elif(r[0] == array_labels[label_counter]):
            if(int(r[2]) > 0):
                qtd.append(int(r[2]))
        else:
            label = {
                'name': array_labels[label_counter],
                'qtd': qtd
            }
            data_array.append(label)
            qtd = []
            label_counter += 1
    return data_array

data = get_sheet()
print_boxplot(data)