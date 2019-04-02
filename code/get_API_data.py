from github import Github
import json
import time

repos = ['rstudio/shiny', 'Microsoft/vscode']  # owner and repo name

d = {
    "repos": {}
}

# using username and password
g = Github("claudiaps", "jpk0mgt10")


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
            print(g.rate_limiting[0])
            issue = repo.get_issue(i.number)
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
    if (number == 10):
        print('Número de requisições prestes a exceder. Um contador se iniciará, após 1hr o código voltará a executar normalmente de onde este parou')
        time.sleep(3600)
        print('Retomando a execução')
        number = 0
    return number


get_data()
