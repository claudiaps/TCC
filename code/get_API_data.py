from github import Github
import json
import time

repos = ['nextcloud/server']  # owner and repo name

d = {
    "repos": {}
}

tokens = ['fe7fcade9517281d5df2c15c34b1025a2dc117e1', 'c182bd8fc09dc3ecc450d85459a68420c4ca0789', '771d2b6c6cc9d069a72c1c8f13d7ac6f5e5c58c6']
token_indice = 0
# using username and password
g = Github(tokens[token_indice])
repo = None


def get_data():
    flag = True
    while flag:
        try:
            flag = False
            global token_indice
            global g
            global tokens
            global repo
            # get info about the repo
            for repo_name in repos:
                treat_requests_number(g.rate_limiting[0], repo_name)
                repo = g.get_repo(repo_name)

                r = {
                    'issues': []
                }
                d['repos'][repo_name] = r
                issues = repo.get_issues(state="all")
                treat_requests_number(g.rate_limiting[0], repo_name)
                for i in issues:
                    issue = repo.get_issue(i.number)
                    print(g.rate_limiting[0], issue)
                    time.sleep(0.05)
                    treat_requests_number(g.rate_limiting[0], repo_name)
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
                        treat_requests_number(g.rate_limiting[0], repo_name)

                    d['repos'][repo_name]['issues'].append(iss)
        except:
            flag = True


    with open('../data/data_github.json', 'w') as outfile:
        json.dump(d, outfile)


def treat_requests_number(number, repo_name):
    global token_indice
    global g
    global tokens
    global repo
    if (number <= 5):
        token_indice += 1
        if(token_indice == len(tokens)):
            token_indice = 0
        g = Github(tokens[token_indice])
        repo = g.get_repo(repo_name)

get_data()
