
//
//var rad_xAxis = d3.svg.axis()
//    .scale(x3)
//    .orient("bottom")
//    .ticks(6);
//rad_svg.append("g")
//    .attr("class","rad_axis")
//    .attr("transform","translate(10,600)")
//    .call(rad_xAxis);
//var rad_yAxis = d3.svg.axis()
//    .scale(y3)
//    .orient("left")
//    .ticks(6);
//rad_svg.append("g")
//    .attr("class","rad_axis")
//    .attr("transform","translate(100,-10)")
//    .call(rad_yAxis);

//var brush3 = d3.svg.brush()
//    .x(x3)
//    .y(y3)
//    .on("brushstart", brushstart3)
//    .on("brush", brushmove3)
//    .on("brushend", brushend3);
//yalefaces,iris
//
//d3.csv("data/iris.csv", function(data){

    //attrname = d3.keys(data[0]);

    // console.log("attrname："+attrname);
    //for(var i=0; i<data.length; i++)
    //{
    //    for(var j=0; j<attrname.length-1; j++)
    //    {
    //        data[i][attrname[j]] = +data[i][attrname[j]];
    //    }
    //    csvdata[i] = data[i];
    //    classdataB[i] = data[i][attrname[attrname.length-1]];
    //}
    //console.log(classdataB);

    //reducedata(classdataB);
    //console.log(classdataA);
    //function reducedata(source)//去除重复值
    //{
    //    classdataA.push(source[0]);
    //    for(var i=0; i<source.length; i++)
    //    {
    //        for(var j=i+1; j<source.length; j++)
    //        {
    //            if(source[j]!=source[i])
    //                classdataA.push(source[j]);
    //            break;
    //        }
    //    }
    //    //console.log(classdataA);
    //}

    //normalization(csvdata); //归一化数据
    //
    //function normalization(data){
    //    //求列数组；
    //    var linedata = new Array();
    //    for(var j=0; j<attrname.length-1; j++)
    //    {
    //        var d = new Array();
    //        for(var i=0; i<data.length; i++)
    //        {
    //            d.push(data[i][attrname[j]]);
    //        }
    //        linedata.push(d);
    //    }
    //    //console.log(linedata);
    //    var min = new Array();
    //    var max = new Array(); //最大值，最小值
    //    for(var i=0; i<attrname.length-1; i++)
    //    {
    //        min.push(d3.min(linedata[i]));
    //        max.push(d3.max(linedata[i]));
    //        //console.log("min: "+min+"max: "+max);
    //    }
    //
    //    for(var i=0; i<data.length; i++)
    //    {
    //        var tempdata = new Array();
    //        for(var j=0; j<attrname.length-1; j++)
    //        {
    //            var s_ij = data[i][attrname[j]];
    //            tempdata.push((s_ij-min[j])/(max[j]-min[j]));
    //            //console.log("normaldata: "+tempdata);
    //        }
    //        normaldata.push(tempdata);
    //    }
    //}

    //anchorNumber = attrname.length-1;
    //nodeNumber = csvdata.length;

    //nodes = makeAnchors(anchorNumber); //特征锚点
    //anchor_nodes = makeAnchors(anchorNumber);
    //
    //
    //
    //CalculateCordinate(); //计算样本点的坐标
    //DataCentering(normaldata);
    //
    ////console.log(normaldata);
    //CorrelationCoefficient(centerdata);

    //function CalculateCordinate()
    //{
    //    var c = makeCirclePoints(250,attrname.length-1);
    //    //console.log(c);
    //    for(var i=0; i<csvdata.length; i++)
    //    {
    //        var x, y, d1, d2, d3;
    //        d1=0, d2=0, d3=0;
    //        for(var j=0; j<attrname.length-1; j++)
    //        {
    //            d1 += normaldata[i][j];
    //            d2 += normaldata[i][j]*nodes[j].x;
    //            d3 += normaldata[i][j]*nodes[j].y;
    //        }
    //        //console.log("d1: "+d1+" d2: "+d2+" d3: "+d3);
    //        x = d2 / d1;
    //        y = d3 / d1;
    //        //console.log("x: "+x+" y: "+y);
    //        allnodes.push({x:x,y:y,Class:csvdata[i][attrname[attrname.length-1]],id:i});
    //        //console.log(data[i][attrname[attrname.length-1]]);
    //    }
    //    //console.log(allnodes);
    //}
    //function makeAnchors(Number){
    //    var anchors=[];
    //    var circlePoints=makeCirclePoints(250,Number);
    //    for(var c=0;c<Number;c++){
    //        anchors.push(makeAnchor(attrname[c],circlePoints[c].x,circlePoints[c].y,c));
    //    }
    //    return anchors;
    //}
    //
    //
    //function makeCirclePoints(radius, anchorNumber){
    //    var newPoints=[];
    //    var circleStep = (Math.PI * 2) / anchorNumber;
    //    for(var c=0;c<=anchorNumber;c++){
    //        var x=2*radius - Math.round((Math.cos(c*circleStep) * radius) + radius)+100;//2*250 - Math.round((Math.cos(c*circleStep) * radius) + radius)+100
    //        var y=2*radius - Math.round((Math.sin(c*circleStep) * radius) + radius)+100;
    //        newPoints.push({x: x, y: y});
    //    }
    //    return newPoints;
    //}
    //
    //function DataCentering(data)//normaldata
    //{
    //
    //    var mean = new Array();
    //
    //    for (var i = 0; i < data[0].length; i++) {
    //        var sum = 0, averate = 0;
    //        for (var j = 0; j < data.length; j++) {
    //            sum += data[j][i];
    //        }
    //        averate = sum / data.length;
    //        mean.push(averate);
    //    }
    //
    //    for (var i = 0; i < data.length; i++) {
    //        var temp = new Array();
    //        for (var j = 0; j < data[0].length; j++) {
    //            temp.push(data[i][j] - mean[j]);
    //            //console.log(temp);
    //        }
    //        centerdata.push(temp);
    //    }
    //}
    //
    //
    //function CorrelationCoefficient(data)//centerdata
    //{
    //    var value;
    //    for (var i = 0; i < data[0].length; i++) {
    //        var rowData = new Array();
    //        for (var j = 0; j < data[0].length; j++) {
    //            if (i == j) {
    //                rowData.push(1);
    //            }
    //            else {
    //                var sum = 0;
    //                var sum_x = 0, sum_y = 0;
    //                var r;
    //                for (var m = 0; m < data.length; m++) {
    //                    sum += data[m][i] * data[m][j];
    //                    sum_x += data[m][i] * data[m][i];
    //                    sum_y += data[m][j] * data[m][j];
    //                }
    //                r = sum / Math.sqrt(sum_x * sum_y);
    //                rowData.push(r);
    //            }
    //        }
    //        correlationCoefficient.push(rowData);
    //    }
    //}
    //
    //function makeAnchor(name,x,y,countFlag){
    //    return {
    //        key: name,
    //        x: x,
    //        y: y,
    //        countFlag:countFlag,
    //        fixed: true,
    //        fill: "red",
    //        type: "anchor"
    //    };
    //}

    //颜色
    //var color = d3.scale.category10();
    //function colors(data)
    //{
    //    for(var i=0; i<classdataA.length; i++)
    //    {
    //        if(data == classdataA[i])
    //        {
    //            return color(i);
    //        }
    //    }
    //}


    //特征锚的移动
    //-------------------------------------------------------------------------------------------------------------
    //=============================================================



    //rad_drag.on("drag",function(){
    //    event_dom.setAngle(getAngle(center_XY[0],center_XY[1],d3.mouse(rad_svg.node())[0],d3.mouse(rad_svg.node())[1]));
    //    rad_svg.selectAll("circle.small").remove();
    //    rad_svg.selectAll("text.tt").remove();
    //
    //    allnodes = [];
    //    //console.log("1NODEx:"+nodes[0].x+","+"1NODEy:"+nodes[0].y);
    //    //console.log("2NODEx:"+nodes[1].x+","+"2NODEy:"+nodes[1].y);
    //    //console.log("3NODEx:"+nodes[2].x+","+"3NODEy:"+nodes[2].y);
    //    //console.log("4NODEx:"+nodes[3].x+","+"4NODEy:"+nodes[3].y);
    //    for(var i = 1;i<=anchorNumber;i++)
    //    {
    //
    //        if(event_dom.id==i)
    //        {
    //            //console.log("选中点的的ID:"+i);
    //
    //            nodes[i-1].x=event_dom.data.x;
    //            nodes[i-1].y=event_dom.data.y;
    //
    //            CalculateCordinate();//计算
    //            renderSampleCircle();//绘制
    //            renderText();
    //
    //        }
    //    }
    //
    //});

    //=============================================================


   // var x,y;












//});



//rad_svg.append("g").call(brush3);

//=============================================================================================================================


