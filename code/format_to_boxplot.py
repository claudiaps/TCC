import json
import csv

with open('../data/processed_github_data.json') as f:
    data = json.load(f)

f = open('../data/csv_label_data.csv')
csv_f = csv.reader(f)
for row in csv_f: 
    print(row)

# def get_label_qtd():
#     format_data = []

#     for issue in data:
#         format_data[]

