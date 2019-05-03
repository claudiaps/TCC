from github import Github

repos = ['nextcloud/server']  # owner and repo name

tokens = ['fe7fcade9517281d5df2c15c34b1025a2dc117e1',
          'c182bd8fc09dc3ecc450d85459a68420c4ca0789', '771d2b6c6cc9d069a72c1c8f13d7ac6f5e5c58c6']

g = Github(tokens[1])

for repo_name in repos:
    repo = g.get_repo(repo_name)
    issues = repo.get_issues(state="all")
    # issue = repo.get_issue(15215)
    if(not repo.get_issue(15214)):
        print('ksjdsaj')