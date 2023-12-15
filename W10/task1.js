var bar_chart;
d3.csv("https://1935067t.github.io/InfoVis2023/W10/w10_task1.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 128,
            margin: {top:10, right:10, bottom:20, left:60}
        };

        // data.reverse();
        bar_chart = new BarChart( config, data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });


class BarChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:20, left:60}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

    }

    update() {
        let self = this;

        self.xscale = d3.scaleLinear()
        .domain([0, d3.max(self.data, d => d.length)])
        .range([0, self.inner_width]);
  
        self.yscale = d3.scaleBand()
        .domain(self.data.map(d => d.label))
        .range([0, self.inner_height])
        .paddingInner(0.1);

        self.xaxis = d3.axisBottom( self.xscale )
        .ticks(7)
        .tickSizeOuter(0);
  
        self.yaxis = d3.axisLeft( self.yscale )
        .tickSizeOuter(0);

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("g").data(self.data).exit().remove();

        self.xaxis_group = self.chart.append('g')//?
        .attr('transform', `translate(0, ${self.inner_height})`)
        .call( self.xaxis );

        self.yaxis_group = self.chart.append('g')
        .call( self.yaxis );

        self.chart.selectAll("rect").data(self.data).join("rect")
        .transition().duration(1000)
        .attr("x", 0)
        .attr("y", d => self.yscale(d.label))
        .attr("width", d => self.xscale(d.length))
        .attr("height", self.yscale.bandwidth());
    }

    reverse()
    {
        let self = this;
        self.data.reverse();
        self.update();
    }

    descend()
    {
        let self = this;
        self.data.sort(function(a,b)
        {
            return b.length - a.length;
        });
        self.update();
    }

    ascend()
    {
        let self = this;
        self.data.sort(function(a,b)
        {
            return a.length - b.length;
        });
        self.update();
    }
}

d3.select('#reverse')
.on('click', d => {
    bar_chart.reverse();
});

d3.select('#desc')
.on('click', d => {
    bar_chart.descend();
});

d3.select('#asc')
.on('click', d => {
    bar_chart.ascend();
});
