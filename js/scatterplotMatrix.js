//var width = 960,
//    size = 150,
//    padding = 10;
//
////p_x.domain(traits).rangePoints([0, width+160])
//
//var x = d3.scale.linear()
//    .range([padding / 2, size - padding / 2]);
//
//var y = d3.scale.linear()
//    .range([size - padding / 2, padding / 2]);
//
//var xAxis = d3.svg.axis()
//    .scale(x)
//    .orient("bottom")
//    .ticks(6);
//
//var yAxis = d3.svg.axis()
//    .scale(y)
//    .orient("left")
//    .ticks(6);
//
//var color = d3.scale.category10();

//d3.csv("data/iris.csv", function(error, data)
//{
//    if (error) throw error;
//
//    var domainByTrait = {},
//        traits = d3.keys(data[0]).filter(function(d)
//        { return d !== "Class"; }),
//        n = traits.length;
//    //
//    //大图选中区域----------------------------------------
//    var x2 = d3.scale.linear()
//        .range([padding / 2, size*n - padding / 2]);
//
//    var y2 = d3.scale.linear()
//        .range([size*n - padding / 2, padding / 2]);
//    //----------------------------------------------------
//
//    traits.forEach(function(trait)
//    {
//        domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
//    });
//
//    xAxis.tickSize(size * n);
//    yAxis.tickSize(-size * n);
//
//    var brush = d3.svg.brush()
//        .x(x)
//        .y(y)
//        .on("brushstart", brushstart)
//        .on("brush", brushmove)
//        .on("brushend", brushend);
//
//    var brush2 = d3.svg.brush()
//        .x(x2)
//        .y(y2)
//        .on("brushstart", brushstart2)
//        .on("brush", brushmove2)
//        .on("brushend", brushend2);
//    //svg = d3.select("body").append("svg")
//    var plot_svg = d3.select(".plotAll").append("svg:svg")
//        .attr("width", 1500)
//        .attr("height", size * n + padding)
//        .append("g")
//        .attr("transform", "translate(" + padding + "," + padding / 2 + ")");
//
//    plot_svg.selectAll(".x.axis")
//        .data(traits)
//        .enter().append("g")
//        .attr("class", "x axis")
//        .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
//        .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });
//
//    plot_svg.selectAll(".y.axis")
//        .data(traits)
//        .enter()
//        .append("g")
//        .attr("class", "y axis")
//        .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
//        .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });
//
//    //---------part svg
//    var plotpart_svg = d3.select(".plotpart").append("svg:svg")
//        .attr("width", size * n + padding)
//        .attr("height", size * n + padding)//.style("background-color","yellow")
//        .append("g")
//        .attr("transform", "translate(" + padding + "," + padding / 2 + ")");
//    //方块边框
//    plotpart_svg.append("rect")
//        .attr("class", "frame")
//        .attr("x", padding / 2)
//        .attr("y", padding / 2)
//        .attr("width", size * n - padding)
//        .attr("height", size * n - padding);
//
//    //每个rect
//    var cell = plot_svg.selectAll(".cell")
//        .data(cross(traits, traits))
//        .enter().append("g")//.call(zoom)
//        .attr("class", "cell")
//        .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
//        .each(plot);
//
//        cell.on("click",function(d){
//            //console.log("mouse_cell-id: "+ d.i+","+ d.j+"...n:"+n);
//            //绘画选鼠标移动 的大rect
//                plotpart_svg.selectAll("g").remove();
//
//                var x_num=d.i;var y_num= d.j;
//
//                var cell = plotpart_svg.selectAll(".cell")
//                    .data(cross(traits, traits))
//                    .enter().append("g")
//                    .attr("class", "cell")
//                    .filter(function(d) { return d.i === x_num && d.j === y_num; })
//                    .each(plot);
//
//                cell.call(brush2);
//                function plot(p) {
//                    var cell = d3.select(this);
//
//                    x.domain(domainByTrait[p.x]);
//                    y.domain(domainByTrait[p.y]);
//
//                    cell.selectAll("circle")
//                        .data(data)
//                        .enter().append("circle")
//                        .attr("cx", function(d) { return n*x(d[p.x]); })
//                        .attr("cy", function(d) { return n*y(d[p.y]); })
//                        .attr("r", 4)
//                        .style("fill", function(d) { return color(d.Class); });
//                }
//
//        });
//
//    // Titles for the diagonal.
//    cell.filter(function(d) { return d.i === d.j; }).append("text")
//        .attr("x", padding)
//        .attr("y", padding)
//        .attr("dy", ".71em")
//        .text(function(d) { return d.x; });
//
//   // cell.call(brush);
//
//    function plot(p) {
//        var cell = d3.select(this);
//
//        x.domain(domainByTrait[p.x]);
//        y.domain(domainByTrait[p.y]);
//
//        cell.append("rect")
//            .attr("class", "frame")
//            .attr("x", padding / 2)
//            .attr("y", padding / 2)
//            .attr("width", size - padding)
//            .attr("height", size - padding);
//
//
//        cell.selectAll("circle")
//            .data(data)
//            .enter().append("circle")
//            .attr("cx", function(d) { return x(d[p.x]); })
//            .attr("cy", function(d) { return y(d[p.y]); })
//            .attr("r", 2)
//            .style("fill", function(d) { return color(d.Class); });
//    }
////-----------------------------------------------------------------------------------------------
//    var brushCell;
//    // Clear the previously-active brush, if any.
//    function brushstart(p) {
//        if (brushCell !== this) {
//            d3.select(brushCell).call(brush.clear());
//            x.domain(domainByTrait[p.x]);
//            y.domain(domainByTrait[p.y]);
//            brushCell = this;
//        }
//    }
//
//    // Highlight the selected circles.
//    function brushmove(p) {
//        var e = brush.extent();
//        plot_svg.selectAll("circle").classed("hidden", function(d) {
//
//            return e[0][0] > d[p.x] || d[p.x] > e[1][0]
//                || e[0][1] > d[p.y] || d[p.y] > e[1][1];
//        });
//    }
//
//    // If the brush is empty, select all circles.
//    function brushend() {
//        if (brush.empty()) plot_svg.selectAll(".hidden").classed("hidden", false);
//    }
//    d3.select(self.frameElement).style("height", size * n + padding + 20 + "px");
////-----------------------------------------------------------------------------------------------
//    // brush2
//    var brushCell2;
//    // Clear the previously-active brush, if any.
//    function brushstart2(p) {
//        if (brushCell2 !== this) {
//            d3.select(brushCell2).call(brush2.clear());
//            x2.domain(domainByTrait[p.x]);
//            y2.domain(domainByTrait[p.y]);
//            brushCell2 = this;
//        }
//    }
//
//    // Highlight the selected circles.
//    function brushmove2(p) {
//        var e = brush2.extent();
//        plotpart_svg.selectAll("circle").classed("hidden", function(d) {
//            return e[0][0] > d[p.x] || d[p.x] > e[1][0]
//                || e[0][1] > d[p.y] || d[p.y] > e[1][1];
//        });
//        plot_svg.selectAll("circle").classed("hidden", function(d) {
//            return e[0][0] > d[p.x] || d[p.x] > e[1][0]
//                || e[0][1] > d[p.y] || d[p.y] > e[1][1];
//        });
//    }
//
//    // If the brush is empty, select all circles.
//    function brushend2() {
//        if (brush2.empty())
//        {
//            plotpart_svg.selectAll(".hidden").classed("hidden", false);
//            plot_svg.selectAll(".hidden").classed("hidden", false);
//        }
//
//    }
//    d3.select(self.frameElement).style("height", size * n + padding + 20 + "px");
//
//
//});

function cross(a, b)
{
    var c = [], n = a.length, m = b.length, i, j;
    for (i = -1; ++i < n;)
        for (j = -1; ++j < m;)
            c.push({x: a[i], i: i, y: b[j], j: j});
    return c;
}
