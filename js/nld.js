// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 600 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
console.log("HERE")

const promises = [
    d3.json('./data/miserables.annotated.edges.json'),
    d3.json('./data/miserables.nodes.json')
];

Promise.all(promises).then(function(promisedData){
    data = {
        links: promisedData[0],
        nodes: promisedData[1]
    }
    console.log(data);

    // Initialize the links
    var link = svg.selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
        .style("stroke", "#aaa")

    // Initialize the nodes
    var node = svg.selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
        .attr("r", 5)
        .style("fill", "#69b3a2")
    console.log(data.nodes)

    // Let's list the force we wanna apply on the network
    var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
        .force("link", d3.forceLink()                               // This force provides links between nodes
            .id(function(d) { return d.id; })                     // This provide  the id of a node
            .links(data.links)                                    // and this the list of links
        )
        .force("charge", d3.forceManyBody().strength(-100))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
        .on("end", ticked);

    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function (d) { return d.x+2; })
        .attr("cy", function(d) { return d.y-2; });
    }

}).catch(function(error) {
    console.log(error);
});