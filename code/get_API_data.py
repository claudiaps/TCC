from github import Github
import json
import time

repos = ['nextcloud/server']  # owner and repo name

d = {
    "repos": {}
}

tokens =  ['771d2b6c6cc9d069a72c1c8f13d7ac6f5e5c58c6', 'fd843f724af35901b19c4818f5a474068c528e58']
token_indice = 0
# using username and password
g = Github(tokens[token_indice])


def get_data():
    # get info about the repo
    for repo_name in repos:
        repo = g.get_repo(repo_name)
        treat_requests_number(g.rate_limiting[0])

        r = {
            'issues': []
        }
        d['repos'][repo_name] = r
        issues = repo.get_issues(state="all")
        treat_requests_number(g.rate_limiting[0])
        for i in issues:
            issue = repo.get_issue(i.number)
            print(g.rate_limiting[0], issue)
            treat_requests_number(g.rate_limiting[0])
            iss = {
                "name": issue.raw_data['title'],
                'id': issue.raw_data['number'],
                'user': issue.raw_data['user']['login'],
                'labels': [],
                'created_at': issue.raw_data['created_at'],
                'closed_at': issue.raw_data['closed_at']
            }
            for label in issue.raw_data['labels']:
                iss['labels'].append(label['name'])
                treat_requests_number(g.rate_limiting[0])

            d['repos'][repo_name]['issues'].append(iss)

    with open('../data/data_github.json', 'w') as outfile:
        json.dump(d, outfile)


def treat_requests_number(number):
    global token_indice
    global g
    global tokens
    if (number == 5):
        token_indice += 1
        g = Github(tokens[token_indice])
    return number


get_data()
