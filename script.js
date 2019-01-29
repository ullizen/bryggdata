function chart(data) {
	//Settings
    var dateFormat = d3.timeParse("%Y/%m/%d");
    var dateFormat2 = d3.timeParse("%H:%M:%S");
    var formatDate = d3.timeFormat(d3.timeParse("%-d %b-%y %H:%M:%S"));
    var formatHours = d3.timeFormat(dateFormat2);
    var parseDate = function(date) {
    	var parseFormat = d3.timeParse("%Y-%m-%d %H:%M:%S");
    	console.log(parseFormat(date.substr(0, date.indexOf('.'))));
    	return parseFormat(date.substr(0, date.indexOf('.')));
    };
    var parseHours = function(date) {
    	var parseFormat = d3.timeParse("%Y-%m-%d %H:%M:%S");
    	return parseFormat(date.substr(0, date.indexOf('.'))).setFullYear(2020, 11, 3);
    };
    var width = 1300;
    var height = 470;
    var colors = ["#f93b5b", "#ffbc21"];
    var defaultColor = ["#3d271d"];
    var weekDays = ["Mon", "Tis", "Ons", "Tor", "Fre"];
    var brewers = ["Vänster", "Höger"];

    function getWeekDay(time) {
        return weekDays[parseDate(time).getDay() - 1];
	}

    var colorScale = d3.scaleOrdinal()
    .domain([1,2])
    .range(colors);

    var brewerScale = d3.scaleOrdinal()
    .domain([1,2])
    .range(brewers);

    var svg = d3.select("#chart").append("svg")
                                   .attr("width", width)
                                   .attr("height", height);

	//Setup time axis
	var x = d3.scaleTime()
                   .domain(d3.extent(data, d => parseDate(d.Time)))
                   .range([0 + 70, width - 30]);

    var xAxis = d3.axisBottom()
                  .scale(x)
                  .tickSize(10, 0, 0)
                  .tickFormat(d3.timeFormat(dateFormat))
                  .tickSizeOuter(0);

		  var xAxisGroup = svg.append("g")
		             .attr("class", "xAxis")
		             .attr("transform", "translate(0," + (height - 40) + ")")
		             .call(xAxis);

     //days axis
     var y = d3.scaleBand()
    .domain(weekDays)
    .rangeRound([30, height - 20]);

    var yAxis = d3.axisLeft()
                  .scale(y)
                  .tickSizeOuter(0);

    var yAxisGroup = svg.append("g")
                             .attr("class", "yAxis")
                             .attr("transform", "translate(60, -36)")
                             .call(yAxis);

     // Define the div for the tooltip
	var div = d3.select("body").append("div")	
	    .attr("class", "tooltip")				
	    .style("opacity", 0);

	
    //Attach data to svg
    svg.append("g").selectAll("rect")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("class", "plupp")
                    .attr("x",function(d,i){
                        return x(parseDate(d.Time));
                    })
                    .attr("y", function(d,i){
                       return 200;
                    })
                    .attr("height",function(d,i) {return 9})
                    .attr("width",function(d,i) {return 9})
                    .attr("rx",100)
    				.attr("ry",100)
                    .style("fill", function(d) {return defaultColor})
                    .style("opacity", 0.15)
                    .on("mouseover", function(d) {		
		            div.transition()		
		                .duration(200)		
		                .style("opacity", 1);		
		            div	.html("<div class='brewer-" + d.BrewerId + "'>"  + brewerScale(d.BrewerId) + "</div>" + formatDate((parseDate(d.Time))))	
		                .style("left", (d3.event.pageX - 65) + "px")		
		                .style("top", (d3.event.pageY - 80) + "px");	
		            })
		            .on("mouseout", function(d) {		
			            div.transition()		
			                .duration(500)		
			                .style("opacity", 0);	
			        });

    
	document.getElementsByClassName("yAxis")[0].style.opacity = 0;
    document.getElementById("js-toggle-dateformat").addEventListener("click", toggleDateformat);
    var hourAxis = false;
	function toggleDateformat() {
		document.getElementsByClassName("xAxis")[0].style.opacity = 1;

		if(hourAxis) {
			x = d3.scaleTime()
			       .domain(d3.extent(data, d => parseDate(d.Time)))
			       .range([0 + 70, width - 30]);

			xAxis = d3.axisBottom()
			      .scale(x)
			      .tickSize(10, 0, 0)
			      .tickFormat(d3.timeFormat(dateFormat))
			      .tickSizeOuter(0);

			xAxisGroup
				.transition()
				.call(xAxis);

			svg.selectAll('rect')
			        .transition()
			        .duration(1000)
			        .ease(d3.easeCubicOut)
			        .attr("rx",100)
    				.attr("ry",100)
			        .attr("x",function(d,i){
			            return x(parseDate(d.Time));
			        })
			        .attr("y", function(d,i){
                        return 200;
                    })
                    .style("opacity", 0.15);
		} else {
			x = d3.scaleTime()
			       .domain(d3.extent(data, d => parseHours(d.Time)))
			       .range([0 + 70, width - 30]);

			xAxis = d3.axisBottom()
			      .scale(x)
			      .tickSize(10, 0, 0)
			      .tickFormat(d3.timeFormat(dateFormat2))
			      .tickSizeOuter(0);

			xAxisGroup
				.transition()
				.call(xAxis);

			svg.selectAll('rect')
			        .transition()
			        .duration(1000)
			        .ease(d3.easeCubicOut)
			        .attr("rx",100)
    				.attr("ry",100)
			        .attr("x",function(d,i){
			            return x(parseHours(d.Time));
			        })
			        .attr("y", function(d,i){
                        return 200;
                    })
                    .style("opacity", 0.15);
		}

		hourAxis = !hourAxis;
	}

	document.getElementById("js-sort-brewer").addEventListener("click", sortByBrewer);

	function sortByBrewer() {
		document.getElementsByClassName("xAxis")[0].style.opacity = 0;
		document.getElementsByClassName("yAxis")[0].style.opacity = 0;

		svg.selectAll('rect').filter(function(d) {
            		return d.BrewerId == 1;})
			        .transition()
			        .duration(1000)
			        .ease(d3.easeCubicOut)
			        .attr("x",function(d, i){
			            return i % 20 * 10 + 400;
			        })
			        .attr("y", function(d, i) {return 350 - Math.floor(i/20) * 10})
			        .style("opacity", 0.55)
			        .attr("rx",0)
    				.attr("ry",0);

			        svg.selectAll('rect').filter(function(d) {
            		return d.BrewerId == 2;})
			        .transition()
			        .duration(1000)
			        .ease(d3.easeCubicOut)
			        .attr("x",function(d, i){
			            return i % 20 * 10 + 700;
			        })
			        .attr("y", function(d, i) {return 350 - Math.floor(i/20) * 10})
			        .style("opacity", 0.55)
			        .attr("rx",0)
    				.attr("ry",0);
	}

	document.getElementById("js-sort-ampm").addEventListener("click", sortByAmPm);

	function sortByAmPm() {
		document.getElementsByClassName("xAxis")[0].style.opacity = 0;
		document.getElementsByClassName("yAxis")[0].style.opacity = 0;

		svg.selectAll('rect').filter(function(d) {
            		return formatHours((parseDate(d.Time))) < "12:00:00";})
			        .transition()
			        .duration(1000)
			        .ease(d3.easeCubicOut)
			        .attr("x",function(d, i){
			            return i % 20 * 10 + 400;
			        })
			        .attr("y", function(d, i) {return 350 - Math.floor(i/20) * 10})
			        .style("opacity", 0.5)
			        .attr("rx",0)
    				.attr("ry",0);

			        svg.selectAll('rect').filter(function(d) {
            		return formatHours((parseDate(d.Time))) >= "12:00:00";})
			        .transition()
			        .duration(1000)
			        .ease(d3.easeCubicOut)
			        .attr("x",function(d, i){
			            return i % 20 * 10 + 700;
			        })
			        .attr("y", function(d, i) {return 350 - Math.floor(i/20) * 10})
			        .style("opacity", 0.5)
			        .attr("rx",0)
    				.attr("ry",0);
	}

 	document.getElementById("js-toggle-weekdays").addEventListener("click", toggleWeekdays);
	var isWeekDays = false;
	function toggleWeekdays() {
		if (isWeekDays){
			document.getElementsByClassName("yAxis")[0].style.opacity = 0;
			svg.selectAll('rect')
			        .transition()
			        .duration(1000)
			        .ease(d3.easeCubicOut)
			        .attr("y", function(d,i){
                        return 200;
                    });
		} else {
            document.getElementsByClassName("yAxis")[0].style.opacity = 1;

			svg.selectAll('rect')
			        .transition()
			        .duration(1000)
			        .ease(d3.easeCubicOut)
			        .attr("y", function(d){
                        return y(getWeekDay(d.Time));
                    });
		}

		isWeekDays = !isWeekDays;
	}

	document.getElementById("js-last-week").addEventListener("click", showLastWeek);

	function isLastWeek(time) {
		var date1 = parseDate(time);
		var date2 = new Date();
		var timeDiff = date2.getTime() - date1.getTime();
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
		return diffDays < 7 ? true : false;
	}

	function showLastWeek() {
			svg.selectAll('rect')
			        .transition()
			        .duration(1000)
			        .ease(d3.easeCubicOut)
			        .style("opacity", 0.5)
			        .style("display", function(d){
                        return isLastWeek(d.Time) ? "block" : "none";
                    });
	}

	document.getElementById("js-color-brewer").addEventListener("click", colorBrewer);
	var hasBrewerColor = false;
	function colorBrewer() {
		if(hasBrewerColor) {
			svg.selectAll('rect')
			        .transition()
			        .duration(1000)
			        .ease(d3.easeCubicOut)
			        .style("fill", function(d) {return defaultColor;});
		} else {
			svg.selectAll('rect')
			        .transition()
			        .duration(1000)
			        .ease(d3.easeCubicOut)
			        .style("fill", function(d) {return colorScale(d.BrewerId);});
		}
		hasBrewerColor = !hasBrewerColor;
		
	}

	document.getElementById("js-show-brewercount").addEventListener("click", showBrewerCount);
	var showsBrewerCount = false;
	function showBrewerCount() {
		if(showsBrewerCount) {
			svg.selectAll('rect')
			.transition()
			.duration(1000)
			.ease(d3.easeCubicOut)
			.attr("y", function(d,i){
	                       return 200;
	                    })
		} else {
			var brewer1Count = 0;
			var brewer2Count = 0;
			svg.selectAll('rect')
			.transition()
			.duration(1000)
			.ease(d3.easeCubicOut)
			.attr("y", function(d,i){
	                       if( d.BrewerId == 1){
	                       		brewer1Count++;
	                       		return height - 50 - brewer1Count;
	                       } else {
	                       		brewer2Count++;
	                       		return height - 50 - brewer2Count;
	                       };
	                    })
		}
		
		showsBrewerCount = !showsBrewerCount;
	}
}

chart(data);