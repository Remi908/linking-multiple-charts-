// Add legends function
function addLegend(svg, legendData, position) {
    const legend = svg.append("g").attr("class", "legend");

    legend
        .selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
        .attr("x", position.x + 100)
        .attr("y", (d, i) => position.y)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", d => d.color);
    legend
        .selectAll("text")
        .data(legendData)
        .enter()
        .append("text")
        .attr("x", position.x + 120)
        .attr("y", (d, i) => position.y + 12)
        .text(d => d.label)
        .attr("font-size", "12px");
}

// Load preprocessed data for the bar chart
d3.csv("./data/bar_chart_data.csv").then(data => {
    // Parse sales as numbers
    data.forEach(d => {
        d.Sales = +d.Sales;
    });

    // Set dimensions for the bar chart
    const width = 1000;
    const height = 400;
    const margin = { top: 30, right: 20, bottom: 50, left: 50 };

    // Create SVG container
    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right + 100)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Set scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.Category))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Sales)])
        .range([height, 0]);

    // Add axes
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));
    // Add Chart Title
    svg.append("text")
        .attr("x", width / 2) // Center the title
        .attr("y", -margin.top / 2) // Position above the chart
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Sales by Category");

    //Add x-axis label
    svg.append("text")
        .attr("x", width / 2) // Center below the chart
        .attr("y", height + margin.bottom - 10) // Position just below the x-axis
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Product Categories");
    //Add y-axis label
    svg.append("text")
        .attr("x", -(height / 2)) // Rotate for vertical alignment
        .attr("y", -margin.left + 8) // Position to the left of the y-axis
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)") // Rotate text 90 degrees
        .style("font-size", "10px")
        .text("Total Sales");

    // Add bars
    const bars = svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.Category))
        .attr("y", d => y(d.Sales))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.Sales))
        .attr("fill", "steelblue")
        .on("click", function (event, d) {
            // Reset all bars to default color
            bars.attr("fill", "steelblue");
            // Highlight the selected bar
            d3.select(this).attr("fill", "red");
            // Update the line chart
            updateLineChart(d.Category);
        });

    // Add legend for the bar chart
    addLegend(svg, [{ color: "steelblue", label: "Total Sales by Category" }], { x: width - 150, y: -10 });
});

// Line chart function
function updateLineChart(selectedCategory) {
    d3.csv("./data/line_chart_data.csv").then(data => {
        // Filter data for the selected category
        const filteredData = data.filter(d => d.Category === selectedCategory);
        filteredData.forEach(d => {
            d.Sales = +d.Sales;
        });

        // Clear the previous line chart
        d3.select("#line-chart").select("svg").remove();

        // Set dimensions for the line chart
        const width = 1000;
        const height = 400;
        const margin = { top: 30, right: 20, bottom: 50, left: 50 };

        // Create SVG container
        const svg = d3.select("#line-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Set scales
        const x = d3.scalePoint()
            .domain(filteredData.map(d => d.Month))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.Sales)])
            .range([height, 0]);

        // Add axes
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickFormat(d => d.slice(0, 7))) // Shorten month labels
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g").call(d3.axisLeft(y));

        // Add Chart Title
        svg.append("text")
            .attr("x", width / 2) // Center the title
            .attr("y", -margin.top / 2) // Position above the chart
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Sales From 2015 to 2018");
        //Add x-axis label
        svg.append("text")
            .attr("x", width / 2) // Center below the chart
            .attr("y", height + margin.bottom - 5) // Position just below the x-axis
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Month");
        //Add y-axis label
        svg.append("text")
            .attr("x", -(height / 2)) // Rotate for vertical alignment
            .attr("y", -margin.left + 10) // Position to the left of the y-axis
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)") // Rotate text 90 degrees
            .style("font-size", "12px")
            .text("Total Sales");


        // Add line
        const line = d3.line()
            .x(d => x(d.Month))
            .y(d => y(d.Sales));

        svg.append("path")
            .datum(filteredData)
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", 2);

        // Add legend for the line chart
        addLegend(svg, [{ color: "orange", label: "Monthly Sales Trend" }], { x: width - 200, y: -10 });
    });
}
//Default Line Chart
updateLineChart('Furniture');