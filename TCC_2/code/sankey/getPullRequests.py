from github import Github
import json
import time

repos = ['nextcloud/server']  # owner and repo name

d = {
    "repos": {}
}

tokens = ['76dae6711eb65e5c58f0c3997125576b9ff25e38', '1066d78af373ce87064da896e8ac8ce981783215', '839673a4314b5aa46c511105e57a7bef6c5320e2', '5a30071f59ebaae4fa34e9bde6a6e24ce204df69']
token_indice = 0
# using username and password
g = Github(tokens[token_indice])
repo = None
issue_number = 0

with open('./issuesWithSelectedLabels.json') as f:
    data = json.load(f)

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
                        prs = repo.get_pull(issue_number)
                        print(g.rate_limiting[0], issue_number)                     
                        time.sleep(0.05)
                        treat_requests_number(g.rate_limiting[0], repo_name)
                        iss = {
                            'id': issue_number,
                            'pull-request' : prs.state
                        }
                        d['repos'][repo_name]['issues'].append(iss)
                    except:
                        pass
        except:
            flag = True

    with open('./pullRequests.json', 'w') as outfile:
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
