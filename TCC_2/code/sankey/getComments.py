from github import Github
import json
import time

repos = ['nextcloud/server']  # owner and repo name

d = {
    "repos": {}
}

tokens = ['1066d78af373ce87064da896e8ac8ce981783215', '839673a4314b5aa46c511105e57a7bef6c5320e2', '5a30071f59ebaae4fa34e9bde6a6e24ce204df69', '76dae6711eb65e5c58f0c3997125576b9ff25e38']
token_indice = 0
# using username and password
g = Github(tokens[token_indice])
repo = None
issue_number = 0

with open('./issuesWithSelectedLabels.json') as f:
    data = json.load(f)

repo = g.get_repo(repos[0])
issue = repo.get_issue(17812).get_comments()

def get_data():
    global issue_number
    issue_number = data
    flag = True
    while flag:
        try:
            flag = False
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

                for issue_number in data:
                    try:
                        comments = repo.get_issue(issue_number).get_comments()
                        print(g.rate_limiting[0], issue_number)                     
                        time.sleep(0.05)
                        treat_requests_number(g.rate_limiting[0], repo_name)
                        iss = {
                            'id': issue_number,
                            'comments' : []
                        }
                        for comment in comments:
                            iss['comments'].append(comment.body)
                        d['repos'][repo_name]['issues'].append(iss)
                    except:
                        pass
        except:
            flag = True

    with open('./comments.json', 'w') as outfile:
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
