# -*- coding: UTF-8 -*-

import csv
import json
import os
import copy
import io

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
        if(len(issue['labels'])>0):
            created_date = issue['created_at']
            closed_date = issue['closed_at']
            created_year = int(created_date[:4])
            closed_year = 0
            closed_month = 0
            if(closed_date):
                closed_year = int(closed_date[:4])
                closed_month = int(closed_date[5: - (len(created_date)-7)])
            created_month = int(created_date[5: - (len(created_date)-7)])
            years = closed_year-created_year
            months = closed_month-created_month
            for label in issue['labels']:
                if(years < 0):
                    pass
                    dict_label= {
                        'name': label,
                        'year': created_year,
                        'month': created_month,
                        'quant': 1
                    }
                    processed_data.append(dict_label)
                elif (years == 0):
                    qtd = 1
                    for m in range(created_month, closed_month+1):
                        dict_label = {
                            'name': label,
                            'year': created_year,
                            'month': m,
                            'quant': qtd
                        }
                        processed_data.append(dict_label)   
                        qtd+=1 
                else:
                    
            

        # print(processed_data)


def populate_sheet():
    year = []
    for issues in data['repos']['rstudio/shiny']['issues']:
        date = issues['created_at']
        if(date[:4] not in year):
            year.append(date[:4])
    year.sort()


create_aux()
