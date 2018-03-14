var margins = {top: 60, left: 60, right:20, bottom: 40};
var width = 1600 -margins.left-margins.right;
var height = 500 -margins.top-margins.bottom;

var p_x = d3.scale.ordinal().rangePoints([0, width]),
 p_y = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;
var color = d3.scale.category10();

var parallel_svg = d3.select("#parallel").append("svg:svg")
    .attr("width", width +margins.left+margins.right)
    .attr("height", height + margins.top+margins.bottom)
    .append("g")
    .attr("transform", "translate(" + margins.bottom + "," +margins.top + ")");



//d3.csv("data/iris.csv", function(error, cities) {
//    if (error) throw error;

    // Ϊÿ����ȡά���б�

    //p_x.domain(traits = d3.keys(cities[0]).filter(function (d) {
    //    return d != "Class" && (p_y[d] = d3.scale.linear()
    //            .domain(d3.extent(cities, function (p) {
    //                return +p[d];
    //            }))
    //            .range([height, 0]));
    //}));
    ////console.log("traits:"+traits);
    //// console.log("cities:"+cities);
    //
    //// ������������ӻ�ɫ������
    //background = parallel_svg.append("g")
    //    .attr("class", "background")
    //    .selectAll("path")
    //    .data(cities)
    //    .enter().append("path")
    //    .attr("d", path);
    //
    //// Ϊ����������ɫǰ����
    //foreground = parallel_svg.append("g")
    //    .attr("class", "foreground")
    //    .selectAll("path")
    //    .data(cities)
    //    .enter()
    //    .append("path")
    //    .attr("d", path)
    //    .style("stroke", function(d) {return color(d.Class);});
    //
    //
    //
    //
    //// Ϊÿ��ά�����һ��Ԫ��
    //var g = parallel_svg.selectAll(".dimension")
    //    .data(traits)
    //    .enter().append("g")
    //    .attr("class", "dimension")
    //    .attr("transform", function(d) { return "translate(" + p_x(d) + ")"; });
    //
    //// ���һ����ͱ���
    //g.append("g")
    //    .attr("class", "p_axis")
    //    .each(function(d) { d3.select(this).call(axis.scale(p_y[d])); })
    //    .append("text")
    //    .attr("text-anchor", "middle")
    //    .attr("y", -9)
    //    .text(String);
    //
    //
    //// Ϊÿ�������һ������
    //g.append("g")
    //    .attr("class", "brush")
    //    .each(function(d) { d3.select(this).call(p_y[d].brush = d3.svg.brush().y(p_y[d])
    //        .on("brush", brush));
    //    })
    //    .selectAll("rect")
    //    .attr("x", -8)
    //    .attr("width", 16);
//});

// ���ظ������ݵ��·��
function path(d) {
    return line(traits.map(function(p) { return [p_x(p), p_y[p](d[p])]; }));
}

