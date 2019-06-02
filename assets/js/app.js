// @TODO: YOUR CODE HERE!

// You need to create a scatter plot between two of the data variables 
// such as Healthcare vs. Poverty or Smokers vs. Age.

// Create a scatter plot that represents each state with circle elements. 
// Pull in the data from data.csv by using the d3.csv function. 
// Include state abbreviations in the circles.
// Create and situate your axes and 
// labels to the left and bottom of the chart.

var margin = {top: 20, right: 40, bottom: 150, left: 100},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
console.log(`canvas ${width} by ${height}`);

// Add the svg canvas and shift over by margin
var svg = d3.select("#scatter").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);
var chartGroup = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// scale y to chart height
var yScale = d3.scaleLinear().range([height, 0]);

// scale x to chart width
var xScale = d3.scaleLinear().range([0, width]);

var toolTip = d3.select("body").append("div")
.attr("class", "tooltip").style("opacity", 0);

// Keep track of currently selected x and y data
var currentX = "poverty";
var currentY = "healthcare";

var xValue = function(d) { return d[currentX];}
var yValue = function(d) { return d[currentY];}

// Function to update circles
function updateCircles(healthData, circlesGroup){

  console.log(`Updating circles for ${currentX} and ${currentY}`);
  circlesGroup.transition().duration(500)
    .attr("cx", function(d) { return xScale(xValue(d))})
    .attr("cy", function(d) { return yScale(yValue(d))});
  return circlesGroup;
} 
function updateCircleText(healthData, circlesTextGroup){

  console.log(`Updating circle text for ${currentX} and ${currentY}`);
  circlesTextGroup.transition().duration(500)
    .attr("x", function (d) { return xScale(xValue(d)); })
    .attr("y", function (d) { return yScale(yValue(d))+5; });
  return circlesTextGroup;
} 

// Read data
d3.csv("assets/data/data.csv", function(error, healthData) {
    // Check for error
    // if (error) return console.warn(error);
    if (error) throw error;

    // console.log(healthData);

    // Change string (from CSV) into number format
    healthData.forEach(function(d) {
      d.state = d.state;
      d.abbr = d.abbr;
      d.healthcare = +d.healthcare;
      d.poverty = +d.poverty;
      d.age = +d.age;
      d.income = +d.income;
      d.smokes = +d.smokes;
      d.obesity = +d.obesity;
      //console.log(d.state);
    });

    xScale.domain([d3.min(healthData, xValue)-1, d3.max(healthData, xValue)+1]);
    yScale.domain([d3.min(healthData, yValue)-1, d3.max(healthData, yValue)+1]);    
  
    // Create axis
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    // Add x-axis
    var xAxisDisplay = chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    // Add x-axis labels
    var xLabels = chartGroup.append("g")             
      .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 10) + ")")
      .style("text-anchor", "middle")

    // Poverty (%)
    var povertyLabel = xLabels.append("text")
      .classed("aText", true)
      .classed("active", true)
      .attr("x",0)
      .attr("y",20)
      .attr("value", "poverty")
      .text("In Poverty (%)");

    // Age (Median)
    var ageLabel = xLabels.append("text")
      .classed("aText", true)
      .classed("inactive", true)
      .attr("x",0)
      .attr("y",45)
      .attr("value", "age")
      .text("Age (Median)");
      
    // Household Income (Median)
    var incomeLabel = xLabels.append("text")
      .classed("aText", true)
      .classed("inactive", true)
      .attr("x",0)
      .attr("y",70)
      .attr("value", "income")
      .text("Household Income (Median)");

    // Add y-axis
    var yAxisDisplay = chartGroup.append("g").call(yAxis);

    // Add y-axis labels
    var yLabels = chartGroup.append("g")
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle");

    // Lacks Healthcare (%)
    var healthcareLabel = yLabels.append("text")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .classed("aText", true)
      .classed("active", true)
      .attr("value", "healthcare")
      .text("Lacks Healthcare (%)");      

    // Obese (%)
    var obeseLabel = yLabels.append("text")
      .attr("y", 0 - margin.left + 25)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .classed("aText", true)
      .classed("inactive", true)
      .attr("value", "obesity")
      .text("Obese (%)"); 
          
    // Smokes (%)
    var smokesLabel = yLabels.append("text")
        .attr("y", 0 - margin.left + 50)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("value", "smokes")
        .text("Smokes (%)");     

    // Append dots
    var circlesGroup = chartGroup.selectAll(".stateCircle")
      .data(healthData)
      .enter().append('g');
    
    circlesGroup = circlesGroup.append("circle")
      .attr("class", "stateCircle")
      .attr("r", 10)
      .attr("cx", function(d) { return xScale(xValue(d))})
      .attr("cy", function(d) { return yScale(yValue(d))})
      .style("fill", "teal");

    // Append text to dots
    var circlesTextGroup = chartGroup.selectAll(".stateText")
      .data(healthData)
      .enter().append('g');

    circlesTextGroup = circlesTextGroup.append("text")
      .attr("class","stateText")
      .text(function(d){ return d.abbr; })
      .attr("font-size",10)
      .attr("x", function (d) { return xScale(xValue(d)); })
      .attr("y", function (d) { return yScale(yValue(d))+5; });

    // Initialize tooltip
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (d.state + "<br>" 
        + currentX + ":" + xValue(d) + "<br>" 
        + currentY + ":" + yValue(d));
      });

    // Create the tooltip in chartGroup.
    chartGroup.call(toolTip);

    // Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(d) {
      toolTip.show(d, this);
      })
    // Create "mouseout" event listener to hide tooltip
      .on("mouseout", function(d) {
        toolTip.hide(d);
      });

  // Event listener for xlabel
  xLabels.selectAll("text").on("click", function(data) {
    // Get the value of the label selected
    var value = d3.select(this).attr("value");
    //console.log(value);
    // Set currentX to value
    currentX = value;
    console.log(`currentX is ${currentX}`);
    
    // Update x axis scale and update x axis
    console.log(`New xScale is ${d3.min(healthData, xValue)-1} ${d3.max(healthData, xValue)+1}`);
    updatexScale = xScale.domain([d3.min(healthData, xValue)-1, d3.max(healthData, xValue)+1]);  
    xAxisDisplay = xAxisDisplay.call(d3.axisBottom(updatexScale));

    // Update circle x value
    circlesGroup = updateCircles(healthData, circlesGroup);
    // Update circle text
    circlesTextGroup = updateCircleText(healthData, circlesTextGroup);
    // Update tooltip

    // Set labels to active/inactive
    if(value=="poverty"){
      povertyLabel.classed("active",true);
      povertyLabel.classed("inactive",false);
      ageLabel.classed("active",false);
      ageLabel.classed("inactive",true);
      incomeLabel.classed("active",false);
      incomeLabel.classed("inactive",true);
    } else if(value=="age"){
      povertyLabel.classed("active",false);
      povertyLabel.classed("inactive",true);
      ageLabel.classed("active",true);
      ageLabel.classed("inactive",false);
      incomeLabel.classed("active",false);
      incomeLabel.classed("inactive",true);
    } else if(value=="income"){
      povertyLabel.classed("active",false);
      povertyLabel.classed("inactive",true);
      ageLabel.classed("active",false);
      ageLabel.classed("inactive",true);
      incomeLabel.classed("active",true);
      incomeLabel.classed("inactive",false);
    } else {
      // default
      console.log(`default value is ${value}`);
    }
  });

  // Event listener for ylabel
  yLabels.selectAll("text").on("click", function(data) {
    // Get the value of the label selected
    var value = d3.select(this).attr("value");
    //console.log(value);
    // Set currentY to value
    currentY = value;
    console.log(`currentY is ${currentY}`);
    
    // Update y axis scale and update y axis
    console.log(`New yScale is ${d3.min(healthData, yValue)-1} ${d3.max(healthData, yValue)+1}`);
    updateyScale = yScale.domain([d3.min(healthData, yValue)-1, d3.max(healthData, yValue)+1]);  
    yAxisDisplay = yAxisDisplay.call(d3.axisLeft(updateyScale));

    // Update circle value
    circlesGroup = updateCircles(healthData, circlesGroup);
    // Update circle text
    circlesTextGroup = updateCircleText(healthData, circlesTextGroup);

    // Set labels to active/inactive
    if(value=="healthcare"){
      healthcareLabel.classed("active",true);
      healthcareLabel.classed("inactive",false);
      obeseLabel.classed("active",false);
      obeseLabel.classed("inactive",true);
      smokesLabel.classed("active",false);
      smokesLabel.classed("inactive",true);
    } else if(value=="obesity"){
      healthcareLabel.classed("active",false);
      healthcareLabel.classed("inactive",true);
      obeseLabel.classed("active",true);
      obeseLabel.classed("inactive",false);
      smokesLabel.classed("active",false);
      smokesLabel.classed("inactive",true);
    } else if(value=="smokes"){
      healthcareLabel.classed("active",false);
      healthcareLabel.classed("inactive",true);
      obeseLabel.classed("active",false);
      obeseLabel.classed("inactive",true);
      smokesLabel.classed("active",true);
      smokesLabel.classed("inactive",false);
    } else {
      // default
      console.log(`default value is ${value}`);
    }
  });

});
  

