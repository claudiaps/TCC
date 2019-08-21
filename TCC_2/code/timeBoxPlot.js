
var moment = require('moment');

function openFile() {
    return require('../data/data_github_nextCloud_updated.json');
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

function getLabels(issues) {
    const labels = [];
    const labels_formated = [];
    issues.forEach(issue => {
        if (issue.labels.length > 0) {
            issue.labels.forEach(label => {
                if (!labels.includes(label)) {
                    labels.push(label);
                    labels_formated.push({label, qtd:[]})
                }
            });
        }
    });
    labels_formated.push({ label: "no label", qtd: [] })
    return labels_formated;
}

function getLabelsFrequency(issues) {
    const no_label = []
    let labels = getLabels(issues)
    issues.forEach(issue => {
        console.log(issue.id); 
        if(issue.labels.length > 0){
            issue.labels.forEach(label => {
                labels.forEach(lb => {
                    if(label === lb.label){
                        const time = getCloseTime(issue.created_at, issue.closed_at)
                        const {id} = issue
                        lb.qtd.push(time);
                    }
                })
            });
        }
        else {
            const time = getCloseTime(issue.created_at, issue.closed_at)
            no_label.push(time)
        }
    })
    labels[labels.length-1].qtd = no_label
    return labels;
}

function getCloseTime(createdAt, closedAt) {
    const created = moment(createdAt, "YYYY-MM-DD HH:mm:ss");
    const closed = moment(closedAt, "YYYY-MM-DD HH:mm:ss");
    return closed.diff(created, 'seconds')
}

function getBoxPlotArray(labels) {
    let arrayBox = []
    labels.forEach(label => {
        arrayBox.push({
            name: label.label,
            y: label.qtd,
        })
    })
    return arrayBox;
}

function saveJson(array) {
    var arrayString = JSON.stringify(array)
    var fs = require('fs');
    fs.writeFile("boxplot.json", arrayString, function(err, result) {
        if(err) console.log('error', err);
    });
}

const issues = getClosedIssues();
const labels = getLabelsFrequency(issues);
const arrayBox = getBoxPlotArray(labels);
saveJson(arrayBox);
