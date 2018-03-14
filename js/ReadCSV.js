//平行坐标图的 部分声明
var PraSelectLine = [];//存储选中的line
var PraUnSelectLine=[];

//=======================================================================scatter部分 声明
var color = d3.scale.category10();
var plotdata = new Array(); //原始数据
var plotnormaldata = new Array();
var plottraits = new Array();

var plotpart_svg;
var plot_svg;
var smallcell_countId=0;//给每个圆加个id
var bigcell_countId=0;//给每个圆加个id
var rad_countId=0;
var bigcells,smallcells;
var smallrects;//小矩形

var BigplotselectPoint = {};
var BIgplotUnselectPoint={};
//=======================================================================radviz部分 声明
var rad_width = 1200, rad_height = 640;

var rad_svg = d3.select("#radviz").append("svg:svg")
    .attr("width", rad_width)
    .attr("height", rad_height);//  .style("background-color","#CCC");

var BigCircle = rad_svg.append("circle")
    .attr("class","mycircle")
    .attr("cx", 350)
    .attr("cy", 350)
    .attr("r", 250);

var textarr = [];
var checkBoxAll= [];;//创建属性的全局变量
var radselectPoint={};//选择区域选中的点
var radUnselectPoint={};//选择区域wei选中的点

var csvdata = new Array(); //原始数据
//var attrname = new Array(); //属性名称
var classdataB = new Array(); //重复的类别名称
var classdataA = new Array(); //精简的类别名称
var normaldata = new Array();//归一化后的数据
var allnodes = new Array(); //存储所有的样本点的坐标
var  anchor_nodes = new Array();
var Textflag_isChange = false;
var numberFlag= new Array();//记录锚点顺序
var centerdata = new Array(); //存储中心化数据
var correlationCoefficient = new Array();//存储相关系数
var samples;//样本点

var  anchorNumber;
var nodeNumber;
var nodes;
function colors(data)
{
    for(var i=0; i<classdataA.length; i++)
    {
        if(data == classdataA[i])
        {
            return color(i);
        }
    }
}
//区域选择
var x3 = d3.scale.linear()
    .domain([0,rad_width])
    .range([0,rad_width]);
var y3 = d3.scale.linear()
    .domain([0,rad_height])
    .range([0,rad_height]);

var brush3 = d3.svg.brush()
    .x(x3)
    .y(y3)
    .on("brushstart", brushstart3)
    .on("brush", brushmove3)
    .on("brushend", brushend3);
//Dom
var track;
//path
var track_r=250;
//坐标
var center_XY=[350,350];
//event
var rad_drag;
var event_dom;

//======================================================================================================================
//*   d3.csv回调函数
//======================================================================================================================
d3.csv("data/iris.csv", function(error, data)//iris Class  costOfliving City
{
    if (error) throw error;

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++平行坐标图部分begin

    p_x.domain(traits = d3.keys(data[0]).filter(function (d)
    {
        return d != "Class" && (p_y[d] = d3.scale.linear()
                .domain(d3.extent(data, function (p) {
                    return +p[d];
                }))
                .range([height, 0]));
    }));
    plottraits = d3.keys(data[0]).filter(function(d) { return d !== "Class"; });

    // 在上下文中添加灰色背景线
    var pracount = 0;
    background = parallel_svg.append("parallel_svg:g")
        .attr("class", "background")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", path);

    // 为焦点增加蓝色前景线
    foreground = parallel_svg.append("parallel_svg:g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(data)
        .enter()
        .append("parallel_svg:path")
        .attr("id",function(){
            return "pra"+pracount++;
        })
        .attr("d", path)
        .style("stroke", function(d) {return color(d.Class);});
    //console.log(foreground.attr("id"));
    // 为每个维度添加一组元素
    var g = parallel_svg.selectAll(".trait")
        .data(traits)
        .enter().append("parallel_svg:g")
        .attr("class", "trait")
        .attr("transform", function(d) { return "translate(" + p_x(d) + ")"; })
        .call(d3.behavior.drag()
            .origin(function(d) { return {x: p_x(d)}; })
            .on("dragstart", par_dragstart)
            .on("drag", par_drag)
            .on("dragend", par_dragend));
    // 添加一个轴和标题
    g.append("parallel_svg:g")
        .attr("class", "p_axis")
        .each(function(d) { d3.select(this).call(axis.scale(p_y[d])); })
        .append("parallel_svg:text")
        .attr("text-anchor", "middle")
        .attr("y", -9)
        .text(String);
    // 为每根轴添加一个画笔
    g.append("parallel_svg:g")
        .attr("class", "brush")
        .each(function(d) { d3.select(this).call(p_y[d].brush = d3.svg.brush().y(p_y[d]).on("brush", brush));
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    function par_dragstart(d) {
        i = traits.indexOf(d);
    }

    function par_drag(d) {
        p_x.range()[i] = d3.event.x;
        traits.sort(function(a, b) { return p_x(a) - p_x(b); });
        g.attr("transform", function(d) { return "translate(" + p_x(d) + ")"; });
        foreground.attr("d", path);
    }

    function par_dragend(d) {
        p_x.domain(traits).rangePoints([0, width]);
        var t = d3.transition().duration(500);
        t.selectAll(".trait").attr("transform", function(d) { return "translate(" + p_x(d) + ")"; });
        t.selectAll(".foreground path").attr("d", path);

        t.selectAll(".background path").attr("d", path);
    }

    //平行坐标图柄刷事件
    var para_actives;
    var para_extents;
    function brush()
    {
        //切换前景线显示
        para_actives = traits.filter(function(p) { return !p_y[p].brush.empty(); });
        //console.log("para_actives: "+para_actives); y轴的名字
        para_extents = para_actives.map(function(p) { return p_y[p].brush.extent(); });
        // console.log("para_extents: "+para_extents);
        foreground.style("display", function(d)
        {
            return para_actives.every(function(p, i)
            {
                return para_extents[i][0] <= d[p] && d[p] <= para_extents[i][1];

            }) ? null : "none";

        });
        //散点图矩阵高亮显示
        //plotpart_svg.selectAll("circle").classed("hidden", function(d) {
        //
        //    return para_actives.every(function(p, i)
        //    {
        //        return para_extents[i][0] <= d[p] && d[p] <= para_extents[i][1];
        //
        //    }) ? null : "none";
        //
        //});
        //plot_svg.selectAll("circle").classed("hidden", function(d) {
        //    return para_actives.every(function(p, i)
        //    {
        //        return para_extents[i][0] <= d[p] && d[p] <= para_extents[i][1];
        //
        //    }) ? null : "none";
        //});
        //雷达图的高亮显示
        PraSelectLine = [];
        PraUnSelectLine=[];
        var PraSelect = foreground.filter(function(d){
            return para_actives.every(function(p, i)
            {
                return para_extents[i][0] <= d[p] && d[p] <= para_extents[i][1];

            })
        });
        var PraUnSelect = foreground.filter(function(d){
            return para_actives.every(function(p, i)
            {
                return para_extents[i][0] > d[p] || d[p] > para_extents[i][1];

            })
        });
        for(var i = 0;i<PraUnSelect[0].length;i++)
        {
            PraUnSelectLine.push(parseInt(PraUnSelect[0][i].id.substr(3)));
        }
        for(var i = 0;i<PraUnSelectLine.length;i++)
        {
            d3.select("#bigplot"+PraUnSelectLine[i]).classed("hidden", true);//右边大图选中高亮
            rad_svg.selectAll("#rad"+PraUnSelectLine[i]).classed("hidden", true);//矩阵中的 隐藏
            plot_svg.selectAll("#smallplot"+PraUnSelectLine[i]).classed("hidden", true);//矩阵中的 高亮

        }
        for(var i = 0;i<PraSelect[0].length;i++)
        {
           // console.log(PraSelect[0][i].id.substr(3));
            PraSelectLine.push(parseInt(PraSelect[0][i].id.substr(3)));
        }
        for(var i = 0;i<PraSelectLine.length;i++)
        {
            d3.select("#bigplot"+PraSelectLine[i]).classed("hidden", false);//右边大图选中高亮
            rad_svg.selectAll("#rad"+PraSelectLine[i]).classed("hidden", false);//矩阵中的 高亮
            plot_svg.selectAll("#smallplot"+PraSelectLine[i]).classed("hidden", false);//矩阵中的 高亮

        }

    }
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++平行坐标图部分end
    //+                                                                                                         +
    //+                                                                                                         +
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++散点图矩阵begin
    var  n = traits.length;//维度数
    var domainByTrait = {};
    var plotSvgWidth,plotSvgHight;//画布大小
    var plot_width = 960,
        plot_size = 650/n,
        plot_padding = 5;

    //左边矩阵区域
    var x = d3.scale.linear()
        .range([plot_padding/2, plot_size - plot_padding/2]);

    var y = d3.scale.linear()
        .range([plot_size - plot_padding/2, plot_padding/2]);

////0-1归化-----------------------------------------------------------------------------------------------begin
        Object.extend = function(tObj,sObj){

            for(var i in sObj){
                if(typeof sObj[i] !== "object"){
                    tObj[i] = sObj[i];
                }else if (sObj[i].constructor == Array){
                    tObj[i] = Object.clone(sObj[i]);
                }else{
                    tObj[i] = tObj[i] || {};
                    Object.extend(tObj[i],sObj[i]);
                }
            }
        }
    Object.extend(plotdata,data);//plotdata获得了data的所有属性
    normalization(plotdata); //归一化数据
    function normalization(d){
        //求列数组；
        var linedata = new Array();
        for(var j=0; j<plottraits.length; j++)
        {
            var d1 = new Array();
            for(var i=0; i<d.length; i++)
            {
                d1.push(d[i][plottraits[j]]);
            }
            linedata.push(d1);
        }
        //console.log(linedata);
        var min = new Array();
        var max = new Array(); //最大值，最小值
        for(var i=0; i<plottraits.length; i++)
        {
            min.push(d3.min(linedata[i]));
            max.push(d3.max(linedata[i]));
//                console.log("min: "+min+"max: "+max);
        }

        for(var i=0; i<d.length; i++)
        {
            var tempdata = new Array();
            for(var j=0; j<plottraits.length; j++)
            {
                var s_ij = d[i][plottraits[j]];
                tempdata.push((s_ij-min[j])/(max[j]-min[j]));
                //console.log("normaldata: "+tempdata);
            }
            plotnormaldata.push(tempdata);
        }
        for(var i=0; i<d.length; i++)
        {
            for(var j=0; j<plottraits.length; j++)
            {
                plotdata[i][plottraits[j]]=plotnormaldata[i][j];
            }
        }

    }
////0-1归化-----------------------------------------------------------------------------------------------end

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(6);
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(6);
    //右边大图选中区域----------------------------------------
    var x2 = d3.scale.linear()
        .range([plot_padding / 2, plot_size * n]);
    var y2 = d3.scale.linear()
        .range([plot_size * n,plot_padding / 2]);
    //----------------------------------------------------

    plottraits.forEach(function(trait)
    {
        domainByTrait[trait] = d3.extent(plotdata, function(d) { return d[trait]; });
    });
    xAxis.tickSize(plot_size * n);
    yAxis.tickSize(-plot_size * n);
    //var brush = d3.svg.brush()
    //    .x(x)
    //    .y(y)
    //    .on("brushstart", brushstart)
    //    .on("brush", brushmove)
    //    .on("brushend", brushend);
    var brush2 = d3.svg.brush()
        .x(x2)
        .y(y2)
        .on("brushstart", brushstart2)
        .on("brush", brushmove2)
        .on("brushend", brushend2);

    //svg = d3.select("body").append("svg")
     plot_svg = d3.select(".plotAll").append("svg:svg")
        .attr("width",  plot_size * n + plot_padding*n)//plot_size * n + plot_padding*n
        .attr("height", plot_size * n + plot_padding*n)//         .style("background-color","grey")
         .attr("class","plot_svg")
         .append("g")
        .attr("transform", "translate(" + plot_padding*2 + "," + plot_padding*2 + ")");
    //plot_svg.selectAll(".x.axis")
    //    .data(plottraits)
    //    .enter().append("g")
    //    .attr("class", "x axis")
    //    .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * plot_size + ",0)"; })
    //    .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });
    //
    //plot_svg.selectAll(".y.axis")
    //    .data(plottraits)
    //    .enter()
    //    .append("g")
    //    .attr("class", "y axis")
    //    .attr("transform", function(d, i) { return "translate(0," + i * plot_size + ")"; })
    //    .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

    //---------part svg
     plotpart_svg = d3.select(".plotpart").append("svg:svg")
        .attr("width", plot_size * n + plot_padding*n)
        .attr("height", plot_size * n + plot_padding*n)//.style("background-color","yellow")
        .append("g")
        .attr("transform", "translate(" + plot_padding*2 + "," + plot_padding*2 + ")");
    //方块边框
    plotpart_svg.append("rect")
        .attr("class", "frame")
        .attr("x", plot_padding / 2)
        .attr("y", plot_padding / 2)
        .attr("width", plot_size * n)
        .attr("height", plot_size * n);
    var cell = plot_svg.selectAll(".cell")
        .data(cross(traits, traits))
        .enter().append("g")//.call(zoom)
        .attr("class", "cell")
        .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * plot_size + "," + d.j * plot_size + ")"; })
        .each(smallplot);
    cell.on("click",function(d){
        //console.log("mouse_cell-id: "+ d.i+","+ d.j+"...n:"+n);
        //绘画选鼠标移动 的大rect
        plotpart_svg.selectAll("g").remove();

        var x_num=d.i;var y_num= d.j;

        var cell = plotpart_svg.selectAll(".cell")
            .data(cross(traits, traits))
            .enter().append("g")
            .attr("class", "cell")
            .filter(function(d) { return d.i == x_num && d.j == y_num; })
            .each(bigplot);

        cell.call(brush2);


    });

    //cell.on("mouseover",function(d){
    //    d3.select(this)
    //        .attr("fill","red");
    //    console.log("countID:"+cell.id);
    //})
    //
    // Titles for the diagonal.
    cell.filter(function(d) { return d.i === d.j; }).append("text")
        .attr("x", plot_padding)
        .attr("y", plot_padding)
        .attr("dy", ".71em")
        .text(function(d) { return d.x; });

     //cell.call(brush);
    function bigplot(p) {
        var cell = d3.select(this);
       bigcell_countId=0;//给每个圆加个id

        //x.domain(domainByTrait[p.x]);
        //y.domain(domainByTrait[p.y]);
        x.domain([domainByTrait[p.x][0],domainByTrait[p.x][1]]);
        y.domain([domainByTrait[p.y][0],domainByTrait[p.y][1]]);

        bigcells=cell.selectAll("circle.big")
            .data(plotdata)
            .enter()
            .append("circle")
            .attr("class","big")
            .attr("cx", function(d) {
                return n*x(d[p.x]);
            })
            .attr("cy", function(d) {
                return n*y(d[p.y]);
            })
            .attr("r", 5)
            .attr("id",function() {
                return  "bigplot"+bigcell_countId++;
            })
            .style("fill", function(d) {
                return color(d.Class);

            });

    }
//右边放大图先画一个图坐标为右边起第一行第二个图
    plotpart_svg.selectAll(".cell")
        .data(cross(traits, traits))
        .enter().append("g")
        .attr("class", "cell")
        .filter(function(d) { return d.i == 1 && d.j == 0; })
        .each(bigplot)
        .call(brush2);

  //  console.log( d3.selectAll("circle.big"));
    d3.selectAll(".frame").on("click",function(d){
            //console.log("mouse_cell-id: "+ d.i+","+ d.j+"...n:"+n);
            //绘画选鼠标移动 的大rect
            plotpart_svg.selectAll("g").remove();

            var x_num=d.i;var y_num= d.j;

            var bigcell = plotpart_svg.selectAll(".cell")
                .data(cross(traits, traits))
                .enter().append("g")
                .attr("class", "cell")
                .filter(function(d) { return d.i == x_num && d.j == y_num; })
                .each(bigplot);
             bigcell.call(brush2);

        });

    function smallplot(p) {
        var cell = d3.select(this);
        smallcell_countId=0;//给每个圆加个id
        //x.domain(domainByTrait[p.x]);
        //y.domain(domainByTrait[p.y]);
        //x.domain(domainByTrait[p.x]);
        //y.domain(domainByTrait[p.y]);
        x.domain([domainByTrait[p.x][0],domainByTrait[p.x][1]]);
        y.domain([domainByTrait[p.y][0],domainByTrait[p.y][1]]);


        smallrects = cell.append("rect")
            .attr("class", "frame")
            .attr("x", plot_padding / 2)
            .attr("y", plot_padding / 2)
            .attr("width", plot_size - plot_padding)
            .attr("height", plot_size - plot_padding);

        cell.selectAll("circle.smallcells")
            .data(plotdata)
            .enter().append("circle")
            .attr("class","smallcells")
            .attr("id",function()
            {
               // console.log("countID--small:"+countId);
                return "smallplot"+smallcell_countId++;
            })
            .attr("cx", function(d) {
                return x(d[p.x]);
            })
            .attr("cy", function(d) {
                return y(d[p.y]);
            })
            .attr("r", 2)
            .style("fill", function(d) { return color(d.Class); });

    }


//-----------------------------------------------------------------------------------------------矩阵图刷子
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
//    d3.select(self.frameElement).style("height", plot_size * n + plot_padding + 20 + "px");
//-----------------------------------------------------------------------------------------------
    // brush2
    var brushCell2;
    // Clear the previously-active brush, if any.
    function brushstart2(p) {
        if (brushCell2 !== this) {
            d3.select(brushCell2).call(brush2.clear());
            x2.domain(domainByTrait[p.x]);
            y2.domain(domainByTrait[p.y]);
            brushCell2 = this;
        }
    }

    // Highlight the selected square.
    function brushmove2(p) {
        //散点图矩阵高亮显示
        var e = brush2.extent();
        plotpart_svg.selectAll("circle").classed("hidden", function(d) {
            return e[0][0] > d[p.x] || d[p.x] > e[1][0]
                || e[0][1] > d[p.y] || d[p.y] > e[1][1];
        });
        plot_svg.selectAll("circle").classed("hidden", function(d) {
            return e[0][0] > d[p.x] || d[p.x] > e[1][0]
                || e[0][1] > d[p.y] || d[p.y] > e[1][1];
        });
        //平行坐标图高亮显示
        //foreground.style("display", function(d) {
        //    if(e[0][0] > d[p.x] || d[p.x] > e[1][0] || e[0][1] > d[p.y] || d[p.y] > e[1][1])
        //    {
        //        return "none";
        //    }else{
        //        return null;
        //    }
        //});


        //雷达图的高亮显示
        BigplotselectPoint = [];
        BIgplotUnselectPoint=[];
        var plotSelectCircle = plotpart_svg.selectAll("circle").filter(function(d){
            return e[0][0] < d[p.x] && d[p.x] < e[1][0]
                && e[0][1] < d[p.y] && d[p.y] < e[1][1];
        });
         //for(var i = 0;i<plotSelectCircle[0].length;i++)
         //{
         //   // console.log(plotSelectCircle[0][i].id.substr(7));
         //    BigplotselectPoint.push(parseInt(plotSelectCircle[0][i].id.substr(7)));
         //}
        var plotUnSelectCircle = plotpart_svg.selectAll("circle").filter(function(d){
            return e[0][0] > d[p.x] || d[p.x] > e[1][0]
                || e[0][1] > d[p.y] || d[p.y] > e[1][1];
        });
       // console.log(plotSelectCircle.attr("id"));
        for(var i = 0;i<plotUnSelectCircle[0].length;i++)
        {
            BIgplotUnselectPoint.push( parseInt(plotUnSelectCircle[0][i].id.substr(7)));
        }
       // console.log(BigplotselectPoint);
       //
        for(var i = 0;i<BIgplotUnselectPoint.length;i++)
        {
            //console.log(d3.select("#bigplot"+i));

            rad_svg.selectAll("#rad"+BIgplotUnselectPoint[i]).classed("hidden", true);
            parallel_svg.selectAll("#pra"+BIgplotUnselectPoint[i]).classed("hidden", true);//平行坐标图的 高亮

        }

        for(var i = 0;i<plotSelectCircle[0].length;i++)
        {
            // console.log(selectCircle[0][i].id.substr(3));
            BigplotselectPoint.push( parseInt(plotSelectCircle[0][i].id.substr(7)));
        }
        for(var i = 0;i<BigplotselectPoint.length;i++)
        {

            rad_svg.selectAll("#rad"+BigplotselectPoint[i]).classed("hidden", false);//矩阵中的 高亮
            parallel_svg.selectAll("#pra"+BigplotselectPoint[i]).classed("hidden", false);//平行坐标图的 高亮

        }

    }

    // If the brush is empty, select all circles.
    function brushend2() {
        if (brush2.empty())
        {
            plotpart_svg.selectAll(".hidden").classed("hidden", false);
            plot_svg.selectAll(".hidden").classed("hidden", false);
            rad_svg.selectAll(".hidden").classed("hidden", false);
            //foreground.style("display",null);
            parallel_svg.selectAll(".hidden").classed("hidden", false);
        }

    }
    d3.select(self.frameElement).style("height", plot_size*n + plot_padding + 20 + "px");
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++散点图矩阵部分end
    //+                                                                                                         +
    //+                                                                                                         +
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++雷达图begin

    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++radviz图部分
    attrname = d3.keys(data[0]);
    //traits = d3.keys(data[0]).filter(function(d) { return d !== "Class"; });

    var dataRad = data;
    function paintRad(traits)
    {

        for(var i=0; i<data.length; i++)
        {
            for(var j=0; j<traits.length; j++)
            {
                data[i][traits[j]] = +data[i][traits[j]];
            }
            csvdata[i] = data[i];
            classdataB[i] = data[i][traits[traits.length]];
        }

        reducedata(classdataB);
        //console.log(classdataA);
        function reducedata(source)//去除重复值
        {
            classdataA.push(source[0]);
            for(var i=0; i<source.length; i++)
            {
                for(var j=i+1; j<source.length; j++)
                {
                    if(source[j]!=source[i])
                        classdataA.push(source[j]);
                    break;
                }
            }
            //console.log(classdataA);
        }
        normalization(csvdata); //归一化数据
        function normalization(data){
            //求列数组；
            var linedata = new Array();
            for(var j=0; j<traits.length; j++)
            {
                var d = new Array();
                for(var i=0; i<data.length; i++)
                {
                    d.push(data[i][traits[j]]);
                }
                linedata.push(d);
            }

            //console.log(linedata);
            var min = new Array();
            var max = new Array(); //最大值，最小值
            for(var i=0; i<traits.length; i++)
            {
                min.push(d3.min(linedata[i]));
                max.push(d3.max(linedata[i]));
                //console.log("min: "+min+"max: "+max);
            }

            for(var i=0; i<data.length; i++)
            {
                var tempdata = new Array();
                for(var j=0; j<traits.length; j++)
                {
                    var s_ij = data[i][traits[j]];
                    tempdata.push((s_ij-min[j])/(max[j]-min[j]));
                }
                normaldata.push(tempdata);
                //console.log("normaldata: "+normaldata);
            }
        }

        anchorNumber = traits.length;
        nodeNumber = csvdata.length;

        nodes = makeAnchors(anchorNumber); //特征锚点
        anchor_nodes = makeAnchors(anchorNumber);

        nodes = makeAnchors(anchorNumber); //特征锚点
        anchor_nodes = makeAnchors(anchorNumber);

        CalculateCordinate(); //计算样本点的坐标
        DataCentering(normaldata);

        //console.log(normaldata);
        CorrelationCoefficient(centerdata);
        //特征锚的移动
        //-------------------------------------------------------------------------------------------------------------
        //=============================================================


        rad_drag = d3.behavior.drag();
        rad_drag.on("drag",function(){
            event_dom.setAngle(getAngle(center_XY[0],center_XY[1],d3.mouse(rad_svg.node())[0],d3.mouse(rad_svg.node())[1]));
            rad_svg.selectAll("circle.small").remove();
            rad_svg.selectAll("text.tt").remove();

            allnodes = [];
            //console.log("1NODEx:"+nodes[0].x+","+"1NODEy:"+nodes[0].y);
            //console.log("2NODEx:"+nodes[1].x+","+"2NODEy:"+nodes[1].y);
            //console.log("3NODEx:"+nodes[2].x+","+"3NODEy:"+nodes[2].y);
            //console.log("4NODEx:"+nodes[3].x+","+"4NODEy:"+nodes[3].y);
            for(var i = 1;i<=anchorNumber;i++)
            {
                if(event_dom.id==i)
                {
                    //console.log("选中点的的ID:"+i);

                    nodes[i-1].x=event_dom.data.x;
                    nodes[i-1].y=event_dom.data.y;

                    CalculateCordinate();//计算
                    renderSampleCircle();//绘制
                    renderText();

                }
            }

        });

        //=============================================================
        track_path="m 100,350 a 250,250 0 1 1 0,1z";
        track=rad_svg.append("circle").attr("r",track_r).classed("road",true).attr("transform","translate("+center_XY+")");

        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0.0);

        //特征锚的文字描述
        var AnchorText;
        function renderText(){
            AnchorText = rad_svg.selectAll(".myText")
                .data(nodes)
                .enter()
                .append("text")
                .attr("class","tt")
                .style("fill", "black")
                .attr("dy",".5em")
                .attr("transform",function(d,i){

                    return "rotate("+0+") translate("+ d.x+","+ d.y+")";

                })
                .attr("dx",function(d){
                    return 0 ;
                })
                .attr("dy",function(d){
                    return 0;
                })
                .text(function(d){return d.key;});
        }
        renderText();
        //brush3
        rad_svg.append("g").call(brush3);

     //radviz  function========================================================
        drawAnchor();
        function drawAnchor()
        {
            for(var c=0;c<anchorNumber;c++)//anchorNumber是4 循环画出4个黑色锚点
            {
                createCircle({
                    r:7,
                    id:c+1,
                    angle:c*360/anchorNumber+180,
                    style:{fill:"black"},
                    track:{
                        r:track_r,
                        center:center_XY
                    }
                });
            }
        }

        function CalculateCordinate()
        {
            var c = makeCirclePoints(250,traits.length);
            //console.log(c);
            for(var i=0; i<csvdata.length; i++)
            {
                var x, y, d1, d2, d3;
                d1=0, d2=0, d3=0;
                for(var j=0; j<traits.length; j++)
                {
                    d1 += normaldata[i][j];
                    d2 += normaldata[i][j]*nodes[j].x;
                    d3 += normaldata[i][j]*nodes[j].y;
                }
                //console.log("d1: "+d1+" d2: "+d2+" d3: "+d3);
                x = d2 / d1;
                y = d3 / d1;
                //console.log("x: "+x+" y: "+y);
                allnodes.push({x:x,y:y,Class:csvdata[i][attrname[traits.length]],id:i});//allnodes
                //console.log(data[i][attrname[attrname.length-1]]);
            }
            //console.log(allnodes);
        }
        function makeAnchors(Number){
            var anchors=[];
            var circlePoints=makeCirclePoints(250,Number);
            for(var c=0;c<Number;c++){
                anchors.push(makeAnchor(traits[c],circlePoints[c].x,circlePoints[c].y,c));
            }
            return anchors;
        }

        function makeCirclePoints(radius, anchorNumber){
            var newPoints=[];
            var circleStep = (Math.PI * 2) / anchorNumber;
            for(var c=0;c<=anchorNumber;c++){
                var x=2*radius - Math.round((Math.cos(c*circleStep) * radius) + radius)+100;//2*250 - Math.round((Math.cos(c*circleStep) * radius) + radius)+100
                var y=2*radius - Math.round((Math.sin(c*circleStep) * radius) + radius)+100;
                newPoints.push({x: x, y: y});
            }
            return newPoints;
        }

        function DataCentering(data)//normaldata
        {

            var mean = new Array();

            for (var i = 0; i < data[0].length; i++) {
                var sum = 0, averate = 0;
                for (var j = 0; j < data.length; j++) {
                    sum += data[j][i];
                }
                averate = sum / data.length;
                mean.push(averate);
            }

            for (var i = 0; i < data.length; i++) {
                var temp = new Array();
                for (var j = 0; j < data[0].length; j++) {
                    temp.push(data[i][j] - mean[j]);
                    //console.log(temp);
                }
                centerdata.push(temp);
            }
        }


        function CorrelationCoefficient(data)//centerdata
        {
            var value;
            for (var i = 0; i < data[0].length; i++) {
                var rowData = new Array();
                for (var j = 0; j < data[0].length; j++) {
                    if (i == j) {
                        rowData.push(1);
                    }
                    else {
                        var sum = 0;
                        var sum_x = 0, sum_y = 0;
                        var r;
                        for (var m = 0; m < data.length; m++) {
                            sum += data[m][i] * data[m][j];
                            sum_x += data[m][i] * data[m][i];
                            sum_y += data[m][j] * data[m][j];
                        }
                        r = sum / Math.sqrt(sum_x * sum_y);
                        rowData.push(r);
                    }
                }
                correlationCoefficient.push(rowData);
            }
        }

        function makeAnchor(name,x,y,countFlag){
            return {
                key: name,
                x: x,
                y: y,
                countFlag:countFlag,
                fixed: true,
                fill: "red",
                type: "anchor"
            };
        }

        function getAngle(x1,y1,x2,y2){
            return (Math.atan((y2-y1)/(x2-x1))/Math.PI)*180+((x2-x1)<0?180:360);
        };

        function PieUpdate(dataset) {
            var pie = d3.layout.pie()
                .value(function (d) {
                    return d[1];
                });
            var piedata = pie(dataset);

            //console.log(piedata);
            var outerRadius = 150;
            var innerRadius = 50;

            var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
            rad_svg.selectAll("g.pie").remove();

            var arcs = rad_svg.selectAll("g.pie")
                .data(piedata)
                .enter()
                .append("g")
                .attr("class", "pie")
                .attr("transform", "translate(" + (rad_width / 1.3) + "," + (rad_height / 1.8) + ")");

            var color = d3.scale.category20();
            arcs.append("path")
                .attr("fill", function (d, i) {
                    return color(i);
                })
                .attr("d", function (d) {
                    return arc(d);
                });

            arcs.append("text")
                .attr("transform", function (d) {
                    return "translate(" + arc.centroid(d) + ")";
                })
                .attr("text-anchor", "middle")
                .text(function (d) {
                    if (d.data[2] >= 0) {
                        return d.data[1];
                    }
                    else {
                        return -d.data[1];
                    }
                });

            //添加连接弧外文字的直线元素
            arcs.append("line")
                .attr("stroke", "black")
                //.attr("fill","black")
                .attr("x1", function (d) {
                    return arc.centroid(d)[0] * 1.5;
                })
                .attr("y1", function (d) {
                    return arc.centroid(d)[1] * 1.5;
                })
                .attr("x2", function (d) {
                    return arc.centroid(d)[0] * 1.7;
                })
                .attr("y2", function (d) {
                    return arc.centroid(d)[1] * 1.7;
                });

            //添加弧外的文字元素
//
            arcs.append("text")
                .attr("transform", function (d) {
                    var x = arc.centroid(d)[0] * 2.3;
                    var y = arc.centroid(d)[1] * 2.3;

                    var r = 0;
                    if ((d.endAngle + d.startAngle) / 2 / Math.PI * 180 < 180)  // 0 - 180 度以内的
                        r = 180 * (((d.endAngle + d.startAngle) / 2 - Math.PI / 2) / Math.PI);
                    else  // 180 - 360 度以内的
                        r = 180 * (((d.endAngle + d.startAngle) / 2 + Math.PI / 2) / Math.PI);

                    return "translate(" + x + "," + y + ")" +
                        "rotate(" + r + ")";
                })
                .style("text-anchor", "middle")
                .style("font-size", "11px")
                .style("fill", "black")
                .text(function (d) {
                    //console.log(d.data[0]);
                    return d.data[0];
                });
        }

        function createCircle(p)
        {
            var circle={
                id: p.id,
                data:{}
            };
            circle.gdom=rad_svg.append("g").attr({
                "transform":"translate("+ p.track.center[0]+","+(p.track.center[1])+")"+
                "rotate("+ (p.angle || 0)+")"
            });
            //.attr("class","maodian");
            circle.cdom=circle.gdom.append("circle").attr({
                "r": p.r||5,
                "class": p.class||"ball",
                "transform":"translate("+p.track.r+",0)"
            });

            p.style && circle.cdom.style(p.style);

            circle.setAngle=function(d){
                //记录信息
                circle.data.angle=d;
                circle.data.x=p.track.center[0]+ p.track.r*Math.cos(Math.PI/180*d);
                circle.data.y=p.track.center[1]+ p.track.r*Math.sin(Math.PI/180*d);
                circle.gdom.attr({
                    "transform":"translate("+ p.track.center[0]+","+(p.track.center[1])+")"+ "rotate("+ d +")"
                    //x:p.track.center[0]+250*Math.cos(d),
                    //y:p.track.center[1]+250*Math.cos(d),
                });


            };

            circle.cdom.on("mousedown",function(d){
                event_dom=circle;
                var dataset = new Array();
                for (var i = 0; i < anchorNumber; i++)
                {
                    //console.log(event_dom.id);

                    if (event_dom.id-1 == i) {
                        //	console.log("i:"+attrname[i]);
                        for (var j = 0; j < anchorNumber; j++) {
                            if (j != i) {
                                //console.log("j:"+j);
                                //console.log(correlationCoefficient[i][j]);
                                var r = correlationCoefficient[i][j].toFixed(3);

                                if(r>=0){dataset.push([traits[j],r,"1"]);}
                                else {dataset.push([traits[j],Math.abs(r),"-1"]);}
                                //console.log("j:"+attrname[j]);
                            }
                        }
                    }
                }

                //console.log(dataset);
                PieUpdate(dataset);
                //dataset.length=0;

            });

            circle.cdom.on("mouseover",function(d){

                d3.select(this).style("fill","red");
            });
            circle.cdom.on("mouseout",function(d){

                d3.select(this).style("fill","black");
            });

            circle.cdom.call(rad_drag);
            return circle;
        };
        //绘制样本点
        renderSampleCircle();

    }//paintRad结束
    function renderSampleCircle()
    {
        rad_countId=0;//初始化

        samples = rad_svg.selectAll("circle.small")
            .data(allnodes)
            .enter()
            .append("circle")
            .attr("class","small")
            .attr("id",function()
            {
                return "rad"+rad_countId++;
            })
            //.attr("fill", function(d){
            //    return color(d.Class);
            //})
            .attr("fill","steelblue")
            .attr("cx", function(d){

                return d.x;
            })
            .attr("cy", function(d)
            {
                return d.y;
            })
            .attr("r", 3)
            .attr("type", function(d) {return d.type});        //================提示框开始
        //.on("mouseover",function(d){
        //    d3.select(this)
        //        .attr("fill","red");
        //    //
        //    //提示框，显示样本点的属性信息
        //    var str = traits[0] + ": " + csvdata[d.id][traits[0]] + '<br>';
        //    //console.log(str);
        //    for (var i = 1; i < anchorNumber; i++) {
        //        str += traits[i] + ": " + csvdata[d.id][traits[i]] + '<br>';
        //    }
        //    // console.log(str);
        //    tooltip.html(str)
        //        .style("left", (d3.event.pageX) + "px")
        //        .style("top", (d3.event.pageY + 20) + "px")
        //        .style("opacity", 1.0);
        //
        //})
        //.on("mousemove", function (d) {
        //    tooltip.style("left", (d3.event.pageX) + "px")
        //        .style("top", (d3.event.pageY + 20) + "px");
        //})
        //.on("mouseout", function (d) {
        //    tooltip.style("opacity", 0.0);
        //
        //    d3.select(this)
        //        .transition()
        //        .duration(100)
        //        .attr("fill",color(d.Class));
        //    //.on("mouseout",function(d){
        //
        //});
    }

//c创建checkbox========================================================================================
    var bDiv=document.getElementById("ChooseButton");
    var radChooseButton = document.createElement("input");    // 生成input对象
    radChooseButton.type = "button";                                       // 生成input属性value
    radChooseButton.value = "update";
    radChooseButton.name = "btnone99";                                         // 可用JS中的票数变量替换此处的“99”，供下面的vote()传回；

    radChooseButton.className = "btnone";
    radChooseButton.onclick=function (){
        radChosedUpdate();
    };
    bDiv.appendChild(radChooseButton);                             //将按钮附加到“ bDiv”的td中

    var bDiv=document.getElementById("ChooseButton");
    var radClearButton = document.createElement("input");    // 生成input对象
    radClearButton.type = "button";                                       // 生成input属性value
    radClearButton.value = "clear";
    radClearButton.name = "btnone99";                                         // 可用JS中的票数变量替换此处的“99”，供下面的vote()传回；

    radClearButton.className = "btnone";
    radClearButton.onclick=function (){
        removeRad();
    };
    bDiv.appendChild(radClearButton);


    // traitsAll//checked=true
    var oDiv=document.getElementById("ChooseTraits");
    var chooseTraits=attrname;
    var checkBox;

    for(var i=0;i<chooseTraits.length;i++)
    {
        checkBox=document.createElement("input");
        checkBox.type="checkbox";
        checkBox.id="selectBox";
        checkBox.name="selectBox";
        checkBox.value=chooseTraits[i];
        checkBox.checked = true;
        // document.body.appendChild(o);
        checkBoxAll.push(checkBox);
        var li=document.createElement("li");
        li.appendChild(checkBox);
        li.appendChild(document.createTextNode(chooseTraits[i]));
        var ul=document.createElement("ul");
        ul.appendChild(li);
        oDiv.appendChild(ul);
    }
    textarr = traits;
    paintRad(textarr);//初始视图

    function removeRad()
    {
        rad_svg.selectAll("text.tt").remove();
        rad_svg.selectAll("circle.small").remove();
        rad_svg.selectAll("g").remove();

        //
        //rad_svg .selectAll('*')
        //    .remove();
    }
    function radChosedUpdate()
    {

        removeRad();

        textarr=[];//清空
        var CheckBoxValue="";
        for (var i=0;i<checkBoxAll.length;i++ ){

            if(checkBoxAll[i].checked){ //判断复选框是否选中
               // rad_svg.selectAll("circle.small").remove();
                //console.log(checkBoxAll[i].value );
                textarr.push(checkBoxAll[i].value);
            }
        }
        if(textarr.length ==0)
        {
            textarr = traits;
        }
        paintRad(textarr);//重绘视图

        //console.log(textarr);
    }

});

var brushCell3;
function brushstart3(p) {
    if (brushCell3 !== this) {
        d3.select(brushCell3).call(brush3.clear());
        //x3.domain(domainByTrait3[p.x]);
        //y3.domain(domainByTrait3[p.y]);
        brushCell3 = this;
    }
}
// Highlight the selected square.

function brushmove3(p) {
    //雷达图高亮显示
    var e = brush3.extent();
    //在雷达图中高亮显示
    samples.classed("hidden", function(d) {
        return d.x<e[0][0] || d.x>e[1][0] || d.y<e[0][1] || d.y>e[1][1] ;
    });


    //散点图矩阵右图高亮显示
    radselectPoint = [];
    radUnselectPoint=[];
    //判断选择的点
    var unselectCircle=  samples.filter(function(d) { return d.x<e[0][0] || d.x>e[1][0] || d.y<e[0][1] || d.y>e[1][1]});
    var selectCircle=  samples.filter(function(d) { return d.x>e[0][0] && d.x<e[1][0] && d.y>e[0][1] && d.y<e[1][1] });
   // console.log(selectCircle);

    for(var i = 0;i<unselectCircle[0].length;i++)
    {
       // console.log(selectCircle[0][i].id.substr(3));
        radUnselectPoint.push( parseInt(unselectCircle[0][i].id.substr(3)));
    }
   // console.log(radselectPoint);
    for(var i = 0;i<radUnselectPoint.length;i++)
    {
        //console.log(d3.select("#bigplot"+i));
        d3.select("#bigplot"+radUnselectPoint[i]).classed("hidden", true);//右边大图选中隐藏
        plot_svg.selectAll("#smallplot"+radUnselectPoint[i]).classed("hidden", true);//矩阵中的 隐藏
        parallel_svg.selectAll("#pra"+radUnselectPoint[i]).classed("hidden", true);//平行坐标图的 隐藏

    }
    for(var i = 0;i<selectCircle[0].length;i++)
    {
        // console.log(selectCircle[0][i].id.substr(3));
        radselectPoint.push( parseInt(selectCircle[0][i].id.substr(3)));
    }
    for(var i = 0;i<radselectPoint.length;i++)
    {
        d3.select("#bigplot"+radselectPoint[i]).classed("hidden", false);//右边大图选中高亮
        plot_svg.selectAll("#smallplot"+radselectPoint[i]).classed("hidden", false);//矩阵中的 高亮
        parallel_svg.selectAll("#pra"+radselectPoint[i]).classed("hidden", false);//平行坐标图的 高亮
    }

}// If the brush is empty, select all circles.
    function brushend3(p) {
        if (brush3.empty())
        {
            rad_svg.selectAll(".hidden").classed("hidden", false);
            plotpart_svg.selectAll(".hidden").classed("hidden", false);
            plot_svg.selectAll(".hidden").classed("hidden", false);
         //   foreground.style("display",null);
            parallel_svg.selectAll(".hidden").classed("hidden", false);


        }
}








