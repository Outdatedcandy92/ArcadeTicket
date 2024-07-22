function customDateFormat(date) {
    const formatDay = d3.timeFormat("%d");
    const formatMonth = d3.timeFormat("%B");
    const day = formatDay(date);
    let suffix = "th";
    if (day === "1" || day === "21" || day === "31") {
      suffix = "st";
    } else if (day === "2" || day === "22") {
      suffix = "nd";
    } else if (day === "3" || day === "23") {
      suffix = "rd";
    }
    return `${parseInt(day)}${suffix} ${formatMonth(date)}`;
  }

const url = 'https://cors-anywhere.herokuapp.com/http://hackhour.hackclub.com/api/history/U079HV9PTC7';
const api = 'APIKEY';  



fetch(url, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${api}`
    }
})
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const simplifiedData = data.data.map(item => {
            // Parse the createdAt string into a Date object
            const createdAtDate = new Date(item.createdAt);

            // Format the date as "yyyy-mm-dd"
            const formattedDate = createdAtDate.toISOString().split('T')[0];

            return {
                createdAt: formattedDate,
                elapsed: item.elapsed
            };
        });

        // Accumulate elapsed values by createdAt
        const elapsedByDay = simplifiedData.reduce((acc, { createdAt, elapsed }) => {
            acc[createdAt] = (acc[createdAt] || 0) + elapsed;
            return acc;
        }, {});

        // Log the result
        for (const [day, totalElapsed] of Object.entries(elapsedByDay)) {
            console.log(`${day}: ${totalElapsed / 60}`);
        }

        const dataForGraph = Object.entries(elapsedByDay).map(([day, totalElapsed]) => ({
            day: new Date(day), // Convert day back to Date object for D3 scaleTime
            totalElapsed: totalElapsed / 60 // Assuming you want to convert to hours or another unit
        }));

        // Sort dataForGraph by day in ascending order
        dataForGraph.sort((a, b) => a.day - b.day);

        // Set the dimensions and margins of the graph
        const margin = { top: 20, right: 30, bottom: 60, left: 50 },
            width = 960 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        // Append the svg object to the body of the page
        const svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);


        // Add X axis
        const x = d3.scaleBand()
            .range([0, width])
            .domain(dataForGraph.map(d => d.day))
            .padding(0.1);
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(customDateFormat))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(dataForGraph, d => d.totalElapsed)])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Define the line
        const line = d3.line()
            .x(d => x(d.day) + x.bandwidth() / 2) // Center the line in the band
            .y(d => y(d.totalElapsed));

        // Draw the line
        svg.append("path")
            .datum(dataForGraph)
            .attr("fill", "none")
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        // Optional: Add circles for each data point
        const tooltip = d3.select("#tooltip");

        // Modify the circle (dot) section of your D3 code to handle mouse events
        svg.selectAll(".dot")
            .data(dataForGraph)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.day) + x.bandwidth() / 2)
            .attr("cy", d => y(d.totalElapsed))
            .attr("r", 5)
            .attr("fill", "#69b3a2")
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("Date: " + d.day + "<br/>Elapsed: " + d.totalElapsed)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mousemove", function (event) {
                tooltip.style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        const averageElapsed = d3.mean(dataForGraph, d => d.totalElapsed);

        // Add a horizontal line for the average
        svg.append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", y(averageElapsed))
            .attr("y2", y(averageElapsed))
            .style("stroke", "red") // Change the color as needed
            .style(); // Optional: Makes the line dashed

        // Select the tooltip div and assign it to a variable

    })
    .catch(error => {
        console.error('Error loading the data:', error);
    });


