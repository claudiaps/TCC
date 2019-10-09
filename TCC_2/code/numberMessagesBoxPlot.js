
function openFile() {
    return require('../data/githubDataNextCloud.json');
}

function getClosedIssues() {
    const file = openFile();
    const { repos } = file;
    const { nextcloud: repoName } = repos;
    const { issues } = repoName;

    return issues.filter(issue => {
        if (issue.closed_at) {
            return true;
        }
    })
}

function getNumberComments(issues) {
    const numberComments = []
    issues.forEach(issue => {
        console.log(issue)
        numberComments.push(issue.n_comments)
    })
    return numberComments;
}

function saveJson(array) {
    var arrayString = JSON.stringify(array)
    var fs = require('fs');
    fs.writeFile("../data/boxplotNumberComments.json", arrayString, function(err, result) {
        if(err) console.log('error', err);
    });
}

const file = openFile();
const issues = getClosedIssues();
const labels = getNumberComments(issues);
saveJson(labels);

