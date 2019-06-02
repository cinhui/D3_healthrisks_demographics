// Load data 
d3.csv("assets/data/data.csv", function(error, healthData) {

  if (error) return console.warn(error);

  console.log(healthData);

  healthData.forEach(function(data) {
    console.log(data.id);
  });
});
