# -*- coding: UTF-8 -*-

import csv
import json
import os
import copy
import io

def create_file(row):
    with open('../data/csv_label_nextCloud_updated2.csv', 'w') as file:
        wr = csv.writer(file, quoting=csv.QUOTE_ALL)
        wr.writerow(['name', 'year', 'qtd'])
        for row in row:
            wr.writerow([row['name'], row['year'], row['qtd']])

def get_labels_year():
    list_labels = []
    years = []
    with open('../data/new_nextCloud2.json') as f:
        data = json.load(f)
    for i in data:
        if(i['name'] not in list_labels):
            list_labels.append(i['name'])
        if(i['year'] not in years):
            years.append(int(i['year']))
    years.sort()
    return list_labels, years


def populate_sheet(labels, years):
    row = []
    cont = 0
    j = 0
    magic_number = 12*len(years)
    for label in labels:
        aux = {
            'name': label,
            'year': "",
            'month': "",
            'day' : "",
            'qtd': ""
        }
        for i in range(0, magic_number): # numero magico = (n_labels * 12(meses) * numero_anos) / n_labels
            if cont == 12:
                cont = 0
                j = j + 1
                if j == len(years): # j = numero de anos
                    j = 0
            aux['year'] = str(years[j])
            aux['month'] = str(cont + 1)
            cont = cont + 1
            row.append(copy.copy(aux))

    with open('../data/new_nextCloud2.json') as f:
        data = json.load(f)

    teste = 0
    for line in row:
        for raw in data:
            if(line['name'] == raw['name'] and line['year'] == str(raw['year']) and line['month'] == str(raw['month'])):
                line['qtd'] = raw['qtd']
                teste = teste + 1
                break
            else:
                line['qtd'] = str(0)

    for r in row:
        r['year'] = r['year'] + "-" +r['month'] + "-" +str(1)

    return row


labels, years = get_labels_year()
row = populate_sheet(labels, years)
print(row)
create_file(row)
