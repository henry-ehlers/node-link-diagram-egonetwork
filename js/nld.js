const dataset = "miserables";
const ego = "Valjean";

const promises = [
    d3.json('./data/' + dataset + "." + ego + '.edges.json'),
    d3.json('./data/' + dataset + "." + ego + '.nodes.json')
];

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 1200 - margin.left - margin.right,
  height = 1200 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function color(hop) {
    switch (hop) {
        case -1:
            return 'black';
        case 0:
            return 'black';
        case 1:
            return 'red';
        case 2:
            return 'blue';
        case 3:
            return 'turquoise';
        case 4:
            return 'pink';
        case 5: 
            return 'green';
    }
}

Promise.all(promises).then(function(promisedData){
    data = {
        links: promisedData[0],
        nodes: promisedData[1]
    }

    // Initialize the links
    var link = svg.append('g')
        .attr("stroke-opacity", 1)
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
            .style("stroke", d => color(d.hop))
            .style('stroke-width', d => d.weight);

    // Node Overlay (to space edges from nodes)
    const buffer = svg.append('g')
        .attr('fill', 'white')
        .selectAll("circle.buffer")
        .data(data.nodes)
        .enter()
        .append("circle")
            .attr('class', 'buffer')
            .attr("r", 9);
            
    // Initialize the nodes
    const node = svg.append('g')
        .attr("stroke-width", 1)
        .attr('fill', 'white')
        .selectAll("circle.node")
        .data(data.nodes)
        .enter()
        .append("circle")
            .attr('class', 'node')
            .attr("r", 7)
            .style("stroke", d => color(d.hop))

    // Let's list the force we wanna apply on the network
    var simulation = d3.forceSimulation(data.nodes)                 
        .force("link", 
            d3.forceLink()                               
                //.strength(0.1)
                .id(d => d.id)                    
                .links(data.links)                                  
        )
        .force("charge", 
            d3.forceManyBody()
            .strength(-200))         
        .force("center", 
            d3.forceCenter(width / 2, height / 2))     
        .on("end", ticked);

    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    buffer
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    text
        .attr("x", function (d) { return d.x; })
        .attr("y", function(d) { return d.y; });
    }

}).catch(function(error) {
    console.log(error);
});
