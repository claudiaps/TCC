# -*- coding: UTF-8 -*-

import csv
import json
import os
import copy
import io
from datetime import datetime


def diff_month(d1, d2):
    return (d1.year - d2.year) * 12 + d1.month - d2.month


processed_data = []

with open('data.json') as f:
    data = json.load(f)


def getLabels():
    labels_list = []
    for issues in data['repos']['rstudio/shiny']['issues']:
        for label in issues['labels']:
            if(label not in labels_list):
                labels_list.append(label)
    return labels_list


def create_aux():
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
                # print(label)
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
                        'qtd': 1
                    }
                    m +=1
                    processed_data.append(dict_label)
    print(processed_data)

def populate_sheet():
    year = []
    for issues in data['repos']['rstudio/shiny']['issues']:
        date = issues['created_at']
        if(date[:4] not in year):
            year.append(date[:4])
    year.sort()


create_aux()
