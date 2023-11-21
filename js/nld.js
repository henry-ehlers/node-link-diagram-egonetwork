const dataset = "miserables";
const ego = "Javert";

const promises = [
    d3.json('./data/' + dataset + "." + ego + '.edges.json'),
    d3.json('./data/' + dataset + "." + ego + '.nodes.json')
];

// set the dimensions and margins of the graph
var margin = {top: 1, right: 1, bottom: 1, left: 1};
var width = 750 - margin.left - margin.right;
var height = 750 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function color_fill(hop) {
    switch (hop) {
        case -1:
            return 'black';
        case 0:
            return '#fc8d62';
        case 1:
            return '#a6cee3';
        case 2:
            return '#1f78b4';
        case 3:
            return '#b2df8a';
        case 4:
            return '#33a02c';
    }
}

function color_stroke(hop) {
    switch (hop) {
        case -1:
            return 'black';
        case 0:
            return 'black';
        case 1:
            return '#a6cee3';
        case 2:
            return '#1f78b4';
        case 3:
            return '#b2df8a';
        case 4:
            return '#33a02c';
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
            .style("stroke", d => color_fill(d.hop))
            .style('stroke-width', d => d.weight);

    // Node Overlay (to space edges from nodes)
    const buffer = svg.append('g')
        .attr('fill', 'white')
        .selectAll("circle.buffer")
        .data(data.nodes)
        .enter()
        .append("circle")
            .attr('class', 'buffer')
            .attr("r", 8);
            
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
            .style("stroke", d => color_stroke(d.hop))
            .style("fill", d => color_fill(d.hop))
            .style("opacity", 0.5)
            
    // Text
    const text = svg.append('g')
        .attr('class', 'node-text')
        .style("text-anchor", "middle")
        .style('dominant-baseline', 'central')
        .style("font-size", "6pt")
        .selectAll('text')
        .data(data.nodes)
        .enter()
            .append('text')
                .text(d => Math.floor(Math.random() * 99))
                //.text(d => d.id)

    // Let's list the force we wanna apply on the network
    var simulation = d3.forceSimulation(data.nodes)                 
        .force("link", 
            d3.forceLink()                               
                .strength(0.25)
                .id(d => d.id)                    
                .links(data.links)                                  
        )
        .force("charge", 
            d3.forceManyBody()
            .strength(-200))         
        .force("center", 
            d3.forceCenter(
                (width) / 2.0, 
                (height) / 2.0))     
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
