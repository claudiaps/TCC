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
        if(issue.closed_at){
            return true;
        }
    })
}

function getLabels(issues) {
    const labels = [];
    issues.forEach(issue => {
        if(issue.labels.length > 0){
            issue.labels.forEach(label => {
                if(!labels.includes(label)){
                    labels.push({label, qtd: []});
                }
            });
        }
    });
    labels.push({label: "no label", qtd: []})
    return labels;
}

function getLabelsFrequency(issues) {
    let labels = getLabels(issues)
    const nameLabels = labels.values()
    issues.forEach(issue => {
        console.log(issue.id);
        if(issue.id <= 16600){
            return
        }
        if(issue.labels.length > 0){
            issue.labels.forEach(label => {
                
                labels.forEach(lb => {
                    if(label === lb.label){
                        const time = getCloseTime(issue.created_at, issue.closed_at)
                        lb.qtd.push(time);
                    }
                })
            });
        }
    })
    console.log(labels);
    return labels;
}

function getCloseTime(createdAt, closedAt){
    const created = moment(createdAt, "YYYY-MM-DD HH:mm:ss");
    const closed = moment(closedAt, "YYYY-MM-DD HH:mm:ss");
    return closed.diff(created, 'seconds')
}

const issues = getClosedIssues();
const labels = getLabelsFrequency(issues)
