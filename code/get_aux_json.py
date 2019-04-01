# -*- coding: UTF-8 -*-

import json
from datetime import datetime

#open json file
with open('../data/data_github.json') as f:
    data = json.load(f)

#find the months between two dates
def diff_month(d1, d2):
    return (d1.year - d2.year) * 12 + d1.month - d2.month

#create array with all labels and dates
def create_aux():
    processed_data = []
    for issue in data['repos']['rstudio/shiny']['issues']:
        if(len(issue['labels']) > 0):
            created_date = issue['created_at']
            closed_date = issue['closed_at']
            created_year = int(created_date[:4])
            created_month = int(created_date[5: - (len(created_date)-7)])
            if(closed_date):
                closed_year = int(closed_date[:4])
                closed_month = int(closed_date[5: - (len(created_date)-7)])
            else:
                closed_year = datetime.now().year
                closed_month = datetime.now().month
            months = diff_month(datetime(closed_year, closed_month, 1), datetime(
                created_year, created_month, 1))
            for label in issue['labels']:
                m = created_month
                y = created_year
                for i in range(0, months+1):
                    if(m > 12):
                        m = 1
                        y = created_year + 1
                    dict_label = {
                        'name': label,
                        'year': y,
                        'month': m,
                        'qtd': 0
                    }
                    m +=1
                    processed_data.append(dict_label)
    return processed_data

#join labels in the same date
def join_qtd(processed_data):
    processed_data_with_qtd = []
    for label in processed_data: #get all the different labels 
        if label not in processed_data_with_qtd:
            processed_data_with_qtd.append(label)
    for label in processed_data: #join the equal labels, adding the qtd
        for l in processed_data_with_qtd:
            if(l['name'] == label['name'] and l['year'] == label['year'] and l['month'] == label['month']):
                l['qtd'] += 1
    return processed_data_with_qtd

p = create_aux()
x = join_qtd(p)

with open('../data/processed_github_data.json', 'w') as outfile:
    json.dump(x, outfile)
