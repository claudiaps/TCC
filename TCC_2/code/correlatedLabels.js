var gexf = require('gexf');

function openFile() {
    return require('../data/data_github_nextCloud_updated.json');
}

function getFeatures(issues) {

    issues.forEach(issue => {
        if(issue.labels.length > 0){
            issue.labels.forEach((label, index) => {
                if(label.includes('feature:')){
                    const newLabels = label.split(':')
                    issue.labels.splice(index, index)
                    newLabels.forEach(newLabel => {
                        issue.labels.push(newLabel)
                    })
                }
            })
        }
    })
    console.log(issues)
    return issues
}


function getNodes(issues) {
    const labels = [];
    const labels_formated = [];

    issues.forEach(issue => {
        if (issue.labels.length > 0) {
            issue.labels.forEach(label => {
                if (!labels.includes(label)) {
                    labels.push(label);
                    labels_formated.push({
                        id: label,
                        label: label,
                        attributes: {
                            size: 0
                        }
                    })
                }
            });
        }
    });
    return labels_formated;
}

function getNodesFrequency(issues) {

    let labels = getNodes(issues)
    issues.forEach(issue => {
        if (issue.labels.length > 0) {
            issue.labels.forEach(label => {
                labels.forEach(lb => {
                    if (label === lb.id) {
                        lb.attributes.size += 1;
                    }
                })
            });
        }
    })
    return labels;
}

function getEdges(issues) {

    const edges = [];
    let idEdge = 0;

    e = {
        id: idEdge,
        source: 0,
        target: 0,
        weight: 1,
    }

    let sameIndex = null;
    edges.push(e);
    issues.forEach(issue => {

        if (issue.labels.length >= 2) {
            numberLabels = issue.labels.length;

            for (let i = 0; i < numberLabels; i++) {
                for (let j = i + 1; j < numberLabels; j++) {
                    let lbSource = issue.labels[i]
                    let lbTarget = issue.labels[j]
                    let foundEdge = false;

                    edges.forEach((edge, index) => {
                        if ((edge.source === lbSource && edge.target === lbTarget) || (edge.target === lbSource && edge.source === lbTarget)) {
                            edge.weight += 1
                            foundEdge = true;
                        }
                    })

                    if(!foundEdge){
                        idEdge += 1;
                        e = {
                            id: idEdge,
                            source: lbSource,
                            target: lbTarget,
                            weight: 1,
                        }
                        edges.push(e);
                    }

                }
            }
        }
    })

    return edges;
}

const file = openFile();
const { repos } = file;

const { nextcloud: repoName } = repos;
const { issues } = repoName;
const issuesFormated = getFeatures(issues); 

const nodesFrequency = getNodesFrequency(issuesFormated);
const edges = getEdges(issuesFormated);

const model  = {
    node : [
        {
            id: 'size',
            type: 'integer',
            title: "Size", 
        }
    ]
}

var myGexf = gexf.create(node = model.node);

nodesFrequency.forEach(node => {
    myGexf.addNode(node);
})

edges.forEach(edge => {
    myGexf.addEdge(edge)
})


var doc = myGexf.document;
var fs = require('fs');
fs.writeFile('newfile.gexf', doc, function (err) {
    if (err) throw err;
    console.log('File is created successfully.');
});
