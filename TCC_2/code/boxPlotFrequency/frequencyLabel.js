
var moment = require('moment');

function openFile() {
    return require('../data/data_github_nextCloud_updated.json');
}

// function getClosedIssues() {
//     const file = openFile();
//     const { repos } = file;
//     const { nextcloud: repoName } = repos;
//     const { issues } = repoName;

//     return issues.filter(issue => {
//         if (issue.closed_at) {
//             return true;
//         }
//     })
// }


function getLabelsFrequency(file) {
    const { repos } = file;
    const { nextcloud: repoName } = repos;
    const { issues } = repoName;
    const labelsFrequency = []
    issues.forEach(issue => {
        console.log(issue)
        labelsFrequency.push(issue.labels.length)
    })
    return labelsFrequency;
}

function saveJson(array) {
    var arrayString = JSON.stringify(array)
    var fs = require('fs');
    fs.writeFile("boxplotFrequency.json", arrayString, function(err, result) {
        if(err) console.log('error', err);
    });
}
const file = openFile();
const labels = getLabelsFrequency(file);
saveJson(labels);

// const issues = getClosedIssues();
