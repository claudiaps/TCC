var moment = require('moment');
var axios = require('axios');
const auth = ['1066d78af373ce87064da896e8ac8ce981783215', '839673a4314b5aa46c511105e57a7bef6c5320e2', '5a30071f59ebaae4fa34e9bde6a6e24ce204df69', '76dae6711eb65e5c58f0c3997125576b9ff25e38'];

function openFile() {
    return require('../../data/githubDataNextCloud.json');
}

const selectedLabels = ['bug', 'enhancement', 'needs info']
let sankeyVector = []

function saveJson(issues) {
    const array = []
    issues.forEach(issue => {
        array.push(issue.id)
    })
    var arrayString = JSON.stringify(array)
    var fs = require('fs');
    fs.writeFile("./issuesWithSelectedLabels.json", arrayString, function(err, result) {
        if(err) console.log('error', err);
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
                if (issue.n_comments >= 1) {
                    sankeyLine = [label, '0-1 comments', 1]
                } else if (issue.n_comments >= 2) {
                    sankeyLine = [label, '2 comments', 1]
                } else if (issue.n_comments >= 5) {
                    sankeyLine = [label, '3-5 comments', 1]
                } else if (issue.n_comments >= 11) {
                    sankeyLine = [label, '6-11 comments', 1]
                } else {
                    sankeyLine = [label, '12+ comments', 1]
                }
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
        if (issue.n_comments >= 1) {
            label_comments = '0-1 comments'
        } else if (issue.n_comments >= 2) {
            label_comments = '2 comments'
        } else if (issue.n_comments >= 5) {
            label_comments = '3-5 comments'
        } else if (issue.n_comments >= 11) {
            label_comments = '6-11 comments'
        } else {
            label_comments = '12+ comments'
        }
        const time = getCloseTime(issue.created_at, issue.closed_at)
        let label_time;
        if (time >= 200) label_time = '200 days'
        else if (time >= 400) label_time = '400 days'
        else if (time >= 600) label_time = '600 days'
        else if (time >= 800) label_time = '800 days'
        else label_time = '801+ days'
        sankeyLine = [label_comments, label_time, 1]
        aux.push(sankeyLine)
    })

    unionEntries(aux);

}

function getCloseTime(createdAt, closedAt) {
    const created = moment(createdAt, "YYYY-MM-DD HH:mm:ss");
    const closed = moment(closedAt, "YYYY-MM-DD HH:mm:ss");
    return closed.diff(created, 'days')
}

function getSankeyThirdNode(issues) {

    const aux = []
    let tokenPosition = 0
    let contToken = 0
    let source = null;

    issues.forEach(issue => {

        const time = getCloseTime(issue.created_at, issue.closed_at)
        let source;
        if (time >= 200) source = '200 days'
        else if (time >= 400) source = '400 days'
        else if (time >= 600) source = '600 days'
        else if (time >= 800) source = '800 days'
        else source = '801+ days'

        let sankeyLine;
        let target = undefined;
        if (contToken > 4500) {
            tokenPosition++;
        }
        axios.get(`https://api.github.com/repos/nextcloud/server/pulls/${issue.id}`, {
            headers: { Authorization: `token ${auth[tokenPosition]}` }
        }).then(response => {
            contToken++;
            const { data } = response;
            const { state } = data;
            console.log(state)
            target = state === 'open' ? 'PR Associado' : 'PR Aceito'
        }).catch(ex => {
            console.log('catch pr')
            axios.get(`https://api.github.com/repos/nextcloud/server/issues/17760/comments`, {
                headers: { Authorization: `token ${auth[tokenPosition]}` }
            }).then(response => {
                console.log('object')
                // const { data } = response;
                // target = processComments(data)
                // sankeyLine = [source, target, '1']
                // console.log(sankeyLine, issue.id)
            }).catch(ex => {
                console.log('#',ex.message)
            })
         })
    })
}

function processComments(comments) {
    const code = ''
    if (data.length) {
        let stringsComments = ''
        comments.forEach(comment => {
            stringsComments = stringsComments.concat(comment.body)
        })
        if (stringsComments.includes('`')) {
            code = 'has code'
            return code;
        }
        code = 'has comments';
        return code;
    }
    code = 'without comments'
    return code;

}

const file = openFile();
const { repos } = file;
const { nextcloud: repoName } = repos;
const { issues } = repoName;
const selectedIssues = getIssuesWithLabels(issues)
saveJson(selectedIssues)
// getSankeyFirstNode(selectedIssues);
// getSankeySecondNode(selectedIssues);
// getSankeyThirdNode(selectedIssues);
// console.log(sankeyVector)
