var moment = require('moment');

function openFile() {
    return require('../../data/githubDataNextCloud.json');
}

function getComments() {
    const file = require('./comments.json');
    const { repos } = file;
    const { nextcloud: repoName } = repos;
    const { issues } = repoName;
    return issues;
}

function getPrs() {
    const file = require('./pullRequests.json');
    const { repos } = file;
    const { nextcloud: repoName } = repos;
    const { issues } = repoName;
    return issues;
}

const selectedLabels = ['bug', 'enhancement', 'stale', '0. Needs triage', '3. to review', 'design', 'feature: sharing', '14-feedback', 'no label']
let sankeyVector = []

function saveJson(issues) {
    const array = []
    issues.forEach(issue => {
        array.push(issue.id)
    })
    var arrayString = JSON.stringify(array)
    var fs = require('fs');
    fs.writeFile("./issuesWithSelectedLabels.json", arrayString, function (err, result) {
        if (err) console.log('error', err);
    });
}

function unionEntries(entries) {
    const entriesFormated = entries.reduce((acc, dataAtual) => {
        const value = acc.find(accAtual => (accAtual[0] === dataAtual[0] && accAtual[1] === dataAtual[1]));
        if (value) {
            value[2]++;
        } else {
            acc.push(dataAtual)
        }
        return acc;
    }, [])
    sankeyVector = sankeyVector.concat(entriesFormated)

}

function getIssuesWithLabels(issues) {
    let selectedIssues = [];
    issues.forEach(issue => {
        if (issue.labels.some(label => selectedLabels.includes(label))) {
            selectedIssues.push(issue)
        } else if(issue.labels.length === 0){
            issue.labels.push('no label')
            selectedIssues.push(issue)
        }
    })

    return selectedIssues;
}

function getSankeyFirstNode(issues) {
    const aux = [];
    issues.forEach(issue => {
        issue.labels.forEach(label => {
            if (selectedLabels.includes(label)) {
                let sankeyLine;
                if (issue.n_comments === 0) sankeyLine = [label, '0 comments', 1]
                else if (issue.n_comments === 1) sankeyLine = [label, '1 comments', 1]
                else if (issue.n_comments <= 5) sankeyLine = [label, '2-5 comments', 1]
                else if (issue.n_comments <= 11) sankeyLine = [label, '5-11 comments', 1]
                else sankeyLine = [label, '12+ comments', 1]
                aux.push(sankeyLine)
            }
        })
    })
    unionEntries(aux);

}

function getSankeySecondNode(issues) {
    const aux = [];
    issues.forEach(issue => {
        let sankeyLine;
        let label_comments;
        if (issue.n_comments === 0) label_comments = '0 comments'
        else if (issue.n_comments === 1) label_comments = '1 comments'
        else if (issue.n_comments <= 5) label_comments = '2-5 comments'
        else if (issue.n_comments <= 11) label_comments = '5-11 comments'
        else label_comments = '12+ comments'
    
        const time = getCloseTime(issue.created_at, issue.closed_at)
        let label_time;
        if(time === -1) label_time = 'not closed'
        else if(time <= 10 ) label_time = '0-10 days'
        else if (time <= 200) label_time = '1-200 days'
        else if (time <= 400) label_time = '201-400 days'
        else if (time <= 600) label_time = '401-600 days'
        else if (time <= 800) label_time = '601-800 days'
        else if (time <= 1000) label_time = '801-1000 days'
        else label_time = '1001+ days'
        sankeyLine = [label_comments, label_time, 1]
        aux.push(sankeyLine)
        // console.log({time, label_time})
    })
    unionEntries(aux);

}

function getCloseTime(createdAt, closedAt) {
    const created = moment(createdAt, "YYYY-MM-DD HH:mm:ss");
    let closed;
    if(closedAt){
        closed = moment(closedAt, "YYYY-MM-DD HH:mm:ss");
        return closed.diff(created, 'days');
    }
    return -1
}

function getSankeyThirdNode(issues) {

    const aux = []

    issues.forEach(issue => {
        const time = getCloseTime(issue.created_at, issue.closed_at)
        let sankeyLine;
        let source;
        let target = undefined;

        if(time === -1) source = 'not closed'
        else if(time <= 10 ) source = '0-10 days'
        else if (time <= 200) source = '1-200 days'
        else if (time <= 400) source = '201-400 days'
        else if (time <= 600) source = '401-600 days'
        else if (time <= 800) source = '601-800 days'
        else if (time <= 1000) source = '801-1000 days'
        else source = '1001+ days'

        prs.forEach(pr => {
            if(pr.id === issue.id){
                target = `PR ${pr.state}`
            }
        })
        
        if(!target){
            comments.forEach(comment => {
                if(comment.id === issue.id){
                    comment.comments.forEach(c => {
                        if(c.includes('`')){
                            target = 'Code in comments'
                        }
                    })
                }
                if(!target){
                    target = `No code in comments`
                }
            })
        }
        sankeyLine=[source, target, 1]
        aux.push(sankeyLine)
    })

    unionEntries(aux);
}

const file = openFile();
const comments = getComments();
const prs = getPrs();
const { repos } = file;
const { nextcloud: repoName } = repos;
const { issues } = repoName;
const selectedIssues = getIssuesWithLabels(issues)
// console.log(selectedIssues);

// saveJson(selectedIssues)

getSankeyFirstNode(selectedIssues);
getSankeySecondNode(selectedIssues);
getSankeyThirdNode(selectedIssues);
// console.log(sankeyVector)
var arrayString = JSON.stringify(sankeyVector)
var fs = require('fs');
fs.writeFile("./sankey.json", arrayString, function (err, result) {
    if (err) console.log('error', err);
});