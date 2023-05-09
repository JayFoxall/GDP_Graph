const DisplayGraph = () => {
  const w = 800;
  const h = 400;
  const barWidth = w / 275;
  const padding = 60;

  const svg = d3
    .select(".graph")
    .append("svg")
    .attr("width", w + 100)
    .attr("height", h + 50);

  var tooltip = d3
    .select(".graph")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  document.addEventListener("DOMContentLoaded", () =>
    fetch(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
    )
      .then((response) => response.json())
      .then((data) => {
        let quarterlyGDPdata = data.data;
        let dates = data.data.map((GDPData) => new Date(GDPData[0]));
        let gdp = data.data.map((GDPData) => GDPData[1]);

        const minDate = new Date(d3.min(dates));
        const maxDate = new Date(d3.max(dates));

        const minGDP = d3.min(gdp);
        const maxGDP = d3.max(gdp);

        const heightScale = d3.scaleLinear().domain([0, maxGDP]).range([0, h]);
        const scaledGDP = gdp.map((_GDP) => heightScale(_GDP));
        

        const xScale = d3
          .scaleTime()
          .domain([new Date(minDate), new Date(maxDate)])
          .range([padding, w - padding]);

        const yScale = d3
          .scaleLinear()
          .domain([0, maxGDP])
          .range([h , 0]);

        svg
          .selectAll("rect")
          .data(quarterlyGDPdata)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("data-date", (d) => d[0])
          .attr("data-gdp", (d) => d[1])
          .attr("x", (d, i) => xScale(new Date(d[0])))
          .attr("y", (d) => yScale(d[1]))
          .attr("width", barWidth)
          .attr("height", (d, i) => scaledGDP[i])
          .attr("fill", "pink")
          .attr("index", (d, i) => i)
          .on("mouseover", function (event, d) {
            var i = this.getAttribute("index");

            tooltip.transition().duration(200).style("opacity", 0.6);
            tooltip
              .html(
                new Date(dates[i]).toLocaleDateString('en-gb') +
                  "<br>" +
                  "$" +
                  gdp[i].toFixed(2) + " Billion"
              )
              .attr("data-date", data.data[i][0])
              .style("left", i * barWidth + 30 + "px")
              .style("top", h - 100 + "px");
          })
          .on("mouseout", function () {
            tooltip.transition().duration(200).style("opacity", 0);
          });

        const yAxis = d3.axisLeft(yScale);
        const xAxis = d3.axisBottom(xScale);

        svg
          .append("g")
          .attr("transform", "translate(0," + (h) + ")")
          .attr("id", "x-axis")
          .call(xAxis)

        svg
          .append("g")
          .attr("transform", "translate(" + padding + ",0)")
          .attr("id", "y-axis")
          .call(yAxis);
      })
  );
};
