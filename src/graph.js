const TotalHour = document.getElementById('HourTotal');
const hourText = document.getElementById('HourText');





function fetchData() {
    const slack = localStorage.getItem('slack');
    const api = localStorage.getItem('api');
    const url = `https://cors-proxy-inky.vercel.app/hackhour.hackclub.com/api/history/${slack}`;
    //const url = './data.json';
    //console.log(url);
    //console.log(api,slack);

    return fetch(url, {
        method: 'GET',
        headers: {
            'Origin': 'outdatedcandy92.github.io',
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

            // Format the date as "yyyy-mm-dd" directly from UTC date
            const formattedDate = createdAtDate.toISOString().split('T')[0];
            console.log(formattedDate);
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
        const margin = { top: 20, right: 100, bottom: 60, left: 100 },
            width = 1000 - margin.left - margin.right,
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
                const nextDay = new Date(dateObj);
                nextDay.setDate(nextDay.getDate() + 1);
                return dateObj ? formatDateWithOrdinal(nextDay) : "";
            }))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("fill", "#6d6c6b")
            .style("font-family", "Slackey, sans-serif")


        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(dataForGraph, d => d.totalElapsed)])
            .range([height, 0]);



        // Define the line
        const line = d3.line()
            .x(d => x(d.day) + x.bandwidth() / 2) // Center the line in the band
            .y(d => y(d.totalElapsed));

        // Draw the line
        svg.append("path")
            .datum(dataForGraph)
            .attr("fill", "none")
            .attr("stroke", "#fb8b3c")
            .attr("stroke-width", 2.5)
            .attr("d", line);



        // Modify the circle (dot) section of your D3 code to handle mouse events
        svg.selectAll(".dot")
            .data(dataForGraph)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.day) + x.bandwidth() / 2)
            .attr("cy", d => y(d.totalElapsed))
            .attr("r", 5)
            .attr("fill", "#fb8b3c")
            .attr("stroke", "#6d6c6b")
            .attr("stroke-width", 2)
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("Date: " + (d.day) + "<br/>Hours: " + d.totalElapsed.toFixed(2))
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
            .style("stroke-dasharray", "5,10"); // Add a dashed line




        // Apply styles to the x-axis path and line (ticks)
        svg.selectAll(".domain, .tick line") // Selects the domain line and tick lines of the x-axis
            .style("stroke", "#6d6c6b"); // Set the color of the x-axis line and ticks

        // Add Y axis and set the color for the y-axis elements
        svg.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text").style("font-family", "Slackey, sans-serif")
            .style("fill", "#6d6c6b") // Set the color of the y-axis text
            .style("font-size", "12px") // Set the font size of the y-axis text
            .style("font-family", "Slackey, sans-serif");

        // Apply styles to the y-axis path and line (ticks)
        svg.selectAll(".domain, .tick line") // Selects the domain line and tick lines of the y-axis
            .style("stroke", "#6d6c6b") // Set the color of the y-axis line and ticks

        const goal = localStorage.getItem('Goal');

        // Add a horizontal line for the goal
        if (goal) {
            svg.append("line")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", y(goal))
                .attr("y2", y(goal))
                .style("stroke", "blue") // Change the color as needed
                .style("stroke-dasharray", "5,10"); // Add a dashed line
        }

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Data for the legend
        const legendData = [
            { name: `Average: ${averageElapsed.toFixed(2)}`, color: "red" },
            // Add more legend items as needed
        ];
        if (goal) {
            legendData.unshift({ name: `Goal: ${goal}`, color: color(0) });
        }
        // Create a legend group
        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(10, 30)`); // Adjust the position as needed

        // Add legend items
        legendData.forEach((d, i) => {
            const legendItem = legend.append("g")
            .attr("class", "legend-item")
            .attr("transform", `translate(0, ${i * 20})`); // Adjust the spacing between legend items

            // Add legend color box
            legendItem.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", d.color);

            // Add legend text
            legendItem.append("text")
            .attr("x", 24)
            .attr("y", 9)
            .attr("dy", "0.35em")
            .text(d.name);
        });

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
            //#F1641E, #fc9d71,#F3CEBD,#9f897f
            //.range(["#F1641E", "#fc9d71", "#F3CEBD", "#9f897f"]); 
            .range(["#FFA769", "#FB8B3C", "#FC791B", "#FA6800"]); 
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
            .style("fill", "#6d6c6"); // Set the color of the month labels

        svg.selectAll("rect")
            .data(days)
            .enter().append("rect")
            .attr("width", cellSize - 2)
            .attr("height", cellSize - 2)
            .attr("x", d => d3.timeWeek.count(d3.timeYear(d), d) * cellSize)
            .attr("y", d => d.getDay() * cellSize)
            .attr("rx", 3) // Sets the x-axis corner radius
            .attr("stroke", "#6d6c6b").attr("stroke-width", 1).attr("stroke", "#6d6c6b").attr("stroke-width", 1)
            .attr("fill", d => {
                const dataPoint = dataForGraph.find(p => d3.timeDay(p.day).getTime() === d.getTime());
                return dataPoint ? colorScale(dataPoint.value) : "#fff4da";
            })
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);

                tooltip.html("Date: " + d.toDateString() + "<br/>Elapsed: " + (dataForGraph.find(p => d3.timeDay(p.day).getTime() === d.getTime()) || { value: 0 }).value.toFixed(2))
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
            const legendColors = ["#FFA769", "#FB8B3C", "#FC791B", "#FA6800"];
        
            // Append a group element for the legend
            const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width - 150}, ${height - 50})`); // Adjust the position as needed
        
        // Create legend rectangles and text
        legendColors.forEach((color, i) => {
            legend.append("rect")
                .attr("x", i * 20) // Adjust the spacing as needed
                .attr("y", 0)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);
        });


            

    })
        .catch(error => {
            console.error('Error loading the data:', error);
        });
}



function HandleData() {
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
        const totalElapsedSum = Math.round(dataForGraph.reduce((sum, { totalElapsed }) => sum + totalElapsed, 0));
        console.log("Total Elapsed Sum:", totalElapsedSum);
        TotalHour.innerHTML = `Total Hours: ${totalElapsedSum}`;

        const today = new Date().toISOString().split('T')[0];
        const todayData = dataForGraph.find(({ day }) => day === today);

        if (todayData) {
            console.log(`Total elapsed hours for today (${today}): ${todayData.totalElapsed.toFixed(2)}`);
            hourText.innerHTML = `Hours Done Today: ${todayData.totalElapsed.toFixed(2)}`;
        } else {
            console.log(`No data available for today (${today})`);
            hourText.innerHTML = `No data available for today`;
        }
    });
}

let isHeatmapActive;

function toggleGraph() {
    const graphOption = localStorage.getItem('graphOption');
    console.log('Graph Option:', graphOption);
    if (graphOption === 'heatmap') {
        isHeatmapActive = false;
    } else { 
        isHeatmapActive = true;
    }
    var existingSVG = d3.select("body").select("svg");
    HandleData();
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


function start() {
    const api = localStorage.getItem('api');
    const slack = localStorage.getItem('slack');

    if (api && slack) {
        toggleGraph();
    } else {
        console.log('API Key or Slack not found');
        Swal.fire({
            title: "Error",
            text: "No API Key or Slack ID found",
            icon: "error"
        });
        hourText.innerHTML = "No data available";
        TotalHour.innerHTML = "No data available";

    }
}

start();

// INPUT FUNCTION

function inputapi() {
    Swal.fire({
        title: 'API Key and Slack ID',
        html: `
            <input id="api-input" class="swal2-input" placeholder="Enter API key" autocapitalize="off">
            <input id="slack-input" class="swal2-input" placeholder="Enter Slack ID" autocapitalize="off">
            <label for="graphoption" style="display: block; margin-top: 10px; font-size: 30px; font-weight: bold;">Default Graph Type</label>
            <select id="graphoption" class="swal2-select">
                <option value="line">Line Graph</option>
                <option value="heatmap">Heatmap</option>
            </select>
        `,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            const apiKey = document.getElementById('api-input').value;
            const slackId = document.getElementById('slack-input').value;
            const graphOption = document.getElementById('graphoption').value;
            
            
            if (!localStorage.get('api') && !localStorage.get('slack')) {
                if (!apiKey) {
                    Swal.showValidationMessage('Please enter API key');
                } else if (!slackId) {
                    Swal.showValidationMessage('Please enter Slack ID');
                } else {
                    console.log('API Key:', apiKey);
                    console.log('Slack ID:', slackId);
                    console.log('Graph Option:', graphOption);
                    if (apiKey) {
                        localStorage.setItem('api', apiKey);
                    }
                    if (slackId) {
                        localStorage.setItem('slack', slackId);
                    }
                    if (graphOption) {
                        localStorage.setItem('graphOption', graphOption);
                    }
                }
            } else {
                console.log('API Key:', apiKey);
                console.log('Slack ID:', slackId);
                console.log('Graph Option:', graphOption);
                if (apiKey) {
                    localStorage.setItem('api', apiKey);
                }
                if (slackId) {
                    localStorage.setItem('slack', slackId);
                }
                if (graphOption) {
                    localStorage.setItem('graphOption', graphOption);
                }
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    });
}
