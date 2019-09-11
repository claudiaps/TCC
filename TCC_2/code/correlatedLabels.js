var gexf = require('gexf');

function openFile() {
    return require('../data/data_github_nextCloud_updated.json');
}

function getNodes(file) {
    const { repos } = file;

    const { nextcloud: repoName } = repos;
    const { issues } = repoName;

    const labels = [];
    const labels_formated = [];

    issues.forEach(issue => {
        if (issue.labels.length > 0) {
            issue.labels.forEach(label => {
                if (!labels.includes(label)) {
                    labels.push(label);
                    labels_formated.push({
                        id: label,
                        name: label,
                        viz: {
                            size: 0
                        }
                    })
                }
            });
        }
    });
    return labels_formated;
}

function getNodesFrequency(file) {

    const { repos } = file;
    const { nextcloud: repoName } = repos;
    const { issues } = repoName;

    let labels = getNodes(file)
    issues.forEach(issue => {
        if (issue.labels.length > 0) {
            issue.labels.forEach(label => {
                labels.forEach(lb => {
                    if (label === lb.id) {
                        lb.viz.size += 1;
                    }
                })
            });
        }
    })
    return labels;
}

function getEdges(file) {

    const { repos } = file;
    const { nextcloud: repoName } = repos;
    const { issues } = repoName;

    const edges = [];
    let idEdge = 0;

    e = {
        id: 0,
        source: 0,
        target: 0,
        weight: 1,
    }
    edges.push(e);

    issues.forEach(issue => {

        if (issue.labels.length > 2) {
            let j;
            numberLabels = issue.labels.length;

            for (let i = 0; i < numberLabels; i++) {
                j = i + 1;

                while (j < numberLabels) {
                    lbSource = issue.labels[i]
                    lbTarget = issue.labels[j]

                    edges.forEach(edge => {
                        if ((edge.source === lbSource || edge.target === lbSource) && (edge.source === lbTarget || edge.target === lbTarget)) {
                            edge.weight += 1;
                        }

                        else {
                            e = {
                                id: idEdge,
                                source: lbSource,
                                target: lbTarget,
                                weight: 1,
                            }
                            edges.push(e);
                            idEdge += 1;
                        }
                    })
                    j += 1;
                }
            }
        }
    })

    return edges;
}

const file = openFile();
const nodesFrequency = getNodesFrequency(file);
const edges = getEdges(file);
console.log(edges)

var myGexf = gexf.create();

// nodesFrequency.forEach(node => {
//     myGexf.addNode(node);
// })

// var doc = myGexf.document;
// var fs = require('fs');
// fs.writeFile('newfile.gexf', doc, function (err) {
//     if (err) throw err;
//     console.log('File is created successfully.');
// });
