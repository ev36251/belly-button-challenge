// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const result = metadata.filter(sampleObj => sampleObj.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const result = samples.filter(sampleObj => sampleObj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    // Build a Bubble Chart
    const bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };

    const bubbleData = [bubbleTrace];

    // Render the Bubble Chart
    const bubbleLayout = {
      title: {
        text: 'Bacteria Cultures per Sample',
        font: {
          size: 22,
          weight: 'bold' 
        }
      },
      xaxis: { 
        title: {
          text: 'OTU ID',
          font: {
            size: 16
          }
        }
      },
      yaxis: { 
        title: {
          text: 'Number of Bacteria',
          font: {
            size: 16
          }
        }
      },
      showlegend: false,
      autosize: true // Makes the chart responsive
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const barData = sample_values
    .map((value, index) => ({ value, id: otu_ids[index], label: otu_labels[index] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
    .reverse();

    const barYTicks = barData.map(d => `OTU ${d.id}`);
    const barValues = barData.map(d => d.value);
    const barLabels = barData.map(d => d.label);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const barTrace = {
      x: barValues,
      y: barYTicks,
      text: barLabels,
      type: 'bar',
      orientation: 'h'
    };

    const barChartData = [barTrace];

    // Render the Bar Chart
    const barLayout = {
      title: {
        text: 'Top 10 Bacteria Cultures Found',
        font: {
          size: 22, 
          weight: 'bold'
        }
      },
      xaxis: {
        title: {
          text: 'Number of Bacteria',
          font: {
            size: 16
          }
        }
      },
      margin: { l: 90, r: 90, t: 60, b: 90 }
    };
    

    Plotly.newPlot('bar', barChartData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    const firstSample = sampleNames[0];


    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
buildCharts(newSample);
buildMetadata(newSample);
}

// Initialize the dashboard
init();
