const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const w = 900;
const h = 500;
const padding = 60;

fetch(URL)
  .then(res => res.json())
  .then(data => {
    const svg = d3.select("svg");

    const parseTime = d3.timeParse("%M:%S");

    data.forEach(d => {
      d.TimeParsed = parseTime(d.Time);
      d.YearParsed = new Date(d.Year, 0, 1);
    });

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.YearParsed))
      .range([padding, w - padding]);

    const yScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.TimeParsed))
      .range([padding, h - padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${h - padding})`)
      .call(xAxis);

    svg.append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    const tooltip = d3.select("#tooltip");

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.YearParsed))
      .attr("cy", d => yScale(d.TimeParsed))
      .attr("r", 6)
      .attr("data-xvalue", d => d.YearParsed.toISOString())
      .attr("data-yvalue", d => d.TimeParsed.toISOString())
      .attr("fill", d => d.Doping ? "orange" : "steelblue")
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 0.9)
          .html(`${d.Name} (${d.Nationality})<br/>Año: ${d.Year}<br/>Tiempo: ${d.Time}<br/>${d.Doping}`)
          .attr("data-year", d.YearParsed.toISOString())
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 30) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    // Leyenda
    const legend = svg.append("g").attr("id", "legend");

    legend.append("rect")
      .attr("x", w - 200)
      .attr("y", 100)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "steelblue");

    legend.append("text")
      .attr("x", w - 180)
      .attr("y", 112)
      .text("Sin alegaciones de dopaje");

    legend.append("rect")
      .attr("x", w - 200)
      .attr("y", 130)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "orange");

    legend.append("text")
      .attr("x", w - 180)
      .attr("y", 142)
      .text("Con alegaciones de dopaje");
  });
