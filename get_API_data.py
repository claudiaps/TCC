from github import Github
import json

repos = ['rstudio/shiny'] #owner and repo name 

d = {
    "repos" : {}
}

# using username and password
g = Github("claudiaps", "jpk0mgt10")

# get info about the repo
for repo_name in repos:
    repo = g.get_repo(repo_name)
    r = {
        'issues': []
    }
    d['repos'][repo_name] = r
    issues = repo.get_issues(state="all")

    for i in issues:
        issue = repo.get_issue(i.number)
        iss = {
            "name": issue.raw_data['title'],
            'id' : issue.raw_data['number'],
            'user': issue.raw_data['user']['login'],
            'labels': [],
            'created_at': issue.raw_data['created_at'],
            'closed_at': issue.raw_data['closed_at']
        }
        for label in issue.raw_data['labels']:
            iss['labels'].append(label['name'])
        d['repos'][repo_name]['issues'].append(iss)

print(d)

with open('data_github.json', 'w') as outfile:
    json.dump(d, outfile)
