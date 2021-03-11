from github import Github
import json
import time

repos = ['nextcloud/server']  # owner and repo name

d = {
    "repos": {}
}

# insert your github token here
tokens = []
token_indice = 0
# using username and password
g = Github(tokens[token_indice])
repo = None
issue_number = 0


def get_n_issues():
    global g
    global repo
    global issue_number
    for repo_name in repos:
        repo = g.get_repo(repo_name)
        issues = repo.get_issues(state="all")
        for i in issues:
            issue_number = i.number
            break
    return issue_number


def get_data():
    global issue_number
    issue_number = get_n_issues()
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
                repo = g.get_repo(repo_name)

                r = {
                    'issues': []
                }
                d['repos'][repo_name] = r
                issues = repo.get_issues(state="all")
                while(issue_number > -1):
                    try:
                        issue = repo.get_issue(
                            issue_number)  # arrumar isso aqui
                        print(g.rate_limiting[0], issue.number, issue_number)
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

                        d['repos'][repo_name]['issues'].append(iss)
                        issue_number -= 1
                    except:
                        issue_number -= 1
        except:
            flag = True

    with open('../data/data_github_nextCloud_updated.json', 'w') as outfile:
        json.dump(d, outfile)


def treat_requests_number(number, repo_name):
    global token_indice
    global g
    global tokens
    global repo
    if (number <= 10):
        token_indice += 1
        if(token_indice == len(tokens)):
            token_indice = 0
        g = Github(tokens[token_indice])
        repo = g.get_repo(repo_name)


get_data()
