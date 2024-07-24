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
function fetchData() {
    const url = 'https://cors-anywhere.herokuapp.com/http://hackhour.hackclub.com/api/history/U079HV9PTC7';
    const api = localStorage.getItem('api');

    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${api}`
        }
    })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error loading the data:', error);
        });
}

const data_start = fetchData();
const tooltip = d3.select("#tooltip");



function LineGraph() {
    data_start.then(data => {
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


        // Step 1: Accumulate elapsed values by createdAt
        const elapsedByDay = simplifiedData.reduce((acc, { createdAt, elapsed }) => {
            acc[createdAt] = (acc[createdAt] || 0) + elapsed;
            return acc;
        }, {});

        // Step 2: Sort the data by date
        const sortedData = Object.entries(elapsedByDay).sort(([date1], [date2]) => new Date(date1) - new Date(date2));

        // Step 3: Prepare data for graphing
        const dataForGraph = sortedData.map(([day, totalElapsed]) => ({
            day, // Use the string directly
            totalElapsed: totalElapsed / 60 // Convert to hours or another unit
        }));


        // Sort dataForGraph by day in ascending order

        console.log(dataForGraph);

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

        const uniqueDates = [...new Set(dataForGraph.map(d => d.day))];

        // Convert unique dates to Date objects if they are not already
        // This step is necessary if your dates are strings and you're using a time scale
        const uniqueDateObjects = uniqueDates.map(date => new Date(date));

        // Format the unique dates as "6th June" format
        const formatDateWithOrdinal = (date) => {
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
        };

        // Apply the formatted dates as tick values on the x-axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat((d) => {
                // Find the corresponding date object for the tick value
                const dateObj = uniqueDateObjects.find(date => date.toDateString() === new Date(d).toDateString());
                return dateObj ? formatDateWithOrdinal(dateObj) : "";
            }))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("fill", "#fff")
            .style("color", "#fff"); // Set the color of the x-axis text

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
            .attr("stroke", "#2d9d4a")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        // Optional: Add circles for each data point

        // Modify the circle (dot) section of your D3 code to handle mouse events
        svg.selectAll(".dot")
            .data(dataForGraph)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.day) + x.bandwidth() / 2)
            .attr("cy", d => y(d.totalElapsed))
            .attr("r", 5)
            .attr("fill", "#2d9d4a")
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



        // Apply styles to the x-axis path and line (ticks)
        svg.selectAll(".domain, .tick line") // Selects the domain line and tick lines of the x-axis
            .style("stroke", "#dadde0"); // Set the color of the x-axis line and ticks

        // Add Y axis and set the color for the y-axis elements
        svg.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("fill", "#dadde0"); // Set the color of the y-axis text

        // Apply styles to the y-axis path and line (ticks)
        svg.selectAll(".domain, .tick line") // Selects the domain line and tick lines of the y-axis
            .style("stroke", "#dadde0"); // Set the color of the y-axis line and ticks

    });
};




function heatmap() {

    data_start.then(data => {
        console.log(data);
        const simplifiedData = data.data.map(item => {
            const createdAtDate = new Date(item.createdAt);
            const formattedDate = createdAtDate.toISOString().split('T')[0];
            return {
                createdAt: formattedDate,
                elapsed: item.elapsed
            };
        });

        const elapsedByDay = simplifiedData.reduce((acc, { createdAt, elapsed }) => {
            acc[createdAt] = (acc[createdAt] || 0) + elapsed;
            return acc;
        }, {});

        for (const [day, totalElapsed] of Object.entries(elapsedByDay)) {
            console.log(`${day}: ${totalElapsed / 60}`);
        }

        const dataForGraph = Object.entries(elapsedByDay).map(([day, totalElapsed]) => ({
            day: new Date(day),
            value: totalElapsed / 60
        }));

        dataForGraph.sort((a, b) => a.day - b.day);

        const margin = { top: 30, right: 0, bottom: 0, left: 30 }; // Adjust margins as needed
        const width = 960 - margin.left - margin.right;
        const height = 200 - margin.top - margin.bottom;
        cellSize = 17;

        // Adjust the SVG container to account for margins
        const svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const colorScale = d3.scaleQuantize()
            .domain([0, d3.max(dataForGraph, d => d.value)])
            .range(["#0e4429", "#006d32", "#26a641", "#39d353"]); // GitHub-like green color scale
        const year = new Date().getFullYear();
        const days = d3.timeDays(new Date(year, 0, 1), new Date(year + 1, 0, 1));

        const months = d3.timeMonths(new Date(year, 0, 1), new Date(year + 1, 0, 1));
        svg.selectAll(".month-label")
            .data(months)
            .enter().append("text")
            .attr("class", "month-label")
            .attr("x", d => d3.timeWeek.count(d3.timeYear(d), d) * cellSize)
            .attr("y", -10) // Position labels above the heatmap; adjust as needed
            .attr("text-anchor", "start")
            .text(d => d3.timeFormat("%b")(d))
            .style("fill", "#fff");

        svg.selectAll("rect")
            .data(days)
            .enter().append("rect")
            .attr("width", cellSize - 2)
            .attr("height", cellSize - 2)
            .attr("x", d => d3.timeWeek.count(d3.timeYear(d), d) * cellSize)
            .attr("y", d => d.getDay() * cellSize)
            .attr("rx", 3) // Sets the x-axis corner radius
            .attr("ry", 3) // Sets the y-axis corner radius
            .attr("fill", d => {
                const dataPoint = dataForGraph.find(p => d3.timeDay(p.day).getTime() === d.getTime());
                return dataPoint ? colorScale(dataPoint.value) : "#161b22";
            })
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                
                tooltip.html("Date: " + d.toDateString() + "<br/>Elapsed: " + (dataForGraph.find(p => d3.timeDay(p.day).getTime() === d.getTime()) || { value: 0 }).value)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 40) + "px");
            })
            .on("mousemove", function (event) {
                // Keep the tooltip's position updated with mouse movement
                // Adjust these values as needed
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 40) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

    })
        .catch(error => {
            console.error('Error loading the data:', error);
        });
}



function HandleData(){
    data_start.then(data => {
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


        // Step 1: Accumulate elapsed values by createdAt
        const elapsedByDay = simplifiedData.reduce((acc, { createdAt, elapsed }) => {
            acc[createdAt] = (acc[createdAt] || 0) + elapsed;
            return acc;
        }, {});

        // Step 2: Sort the data by date
        const sortedData = Object.entries(elapsedByDay).sort(([date1], [date2]) => new Date(date1) - new Date(date2));

        // Step 3: Prepare data for graphing
        const dataForGraph = sortedData.map(([day, totalElapsed]) => ({
            day, // Use the string directly
            totalElapsed: totalElapsed / 60 // Convert to hours or another unit
        }));


        // Sort dataForGraph by day in ascending order

        console.log(dataForGraph);
    });
}
HandleData();

let isHeatmapActive = false;



function toggleGraph() {
    var existingSVG = d3.select("body").select("svg");
    if (!existingSVG.empty()) {
        existingSVG.remove();
    }
    if (isHeatmapActive) {
        LineGraph(data_start);
        isHeatmapActive = false;
    } else {
        heatmap();
        isHeatmapActive = true;
    }
}

//toggleGraph();



