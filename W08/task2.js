var data = [
    {x:0, y:100},
    {x:40, y:5},
    {x:120, y:80},
    {x:150, y:30},
    {x:200, y:50}
];

var config = {
    parent: '#drawing_region',
    width: 256,
    height: 128,
    margin: {top:10, right:10, bottom:20, left:60}
};
    

class LineChart {

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

        self.xscale = d3.scaleLinear()
            .domain([0, d3.max(self.data, d => d.x)])
            .range([0, self.inner_width]);
      
        self.yscale = d3.scaleLinear()
            .domain([0,d3.max(self.data, d => d.y)])
            .range([0, self.inner_height]);

        self.line = d3.line()
        .x( d => self.xscale(d.x) )
        .y( d => self.yscale(d.y) );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(7)
            .tickSizeOuter(0);
      
        self.yaxis = d3.axisLeft( self.yscale )
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
        .attr('transform', `translate(0, ${self.inner_height})`)
        .call( self.xaxis );
    
        self.yaxis_group = self.chart.append('g')
        .call( self.yaxis );

    }

    update() {
        let self = this;

        self.render();
    }

    render() {
        let self = this;

        self.chart.append('path')
        .attr('d', self.line(self.data))
        .attr('stroke', 'black')
        .attr('fill', 'none');
    }
}

const line_chart = new LineChart( config, data );
line_chart.update();
