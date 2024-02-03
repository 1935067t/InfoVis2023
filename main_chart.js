class LineChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
            cscale: config.cscale
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.morning_data = self.data.filter(function (d) {
            return  d.time == 'morning';
          });

        self.lunch_data = self.data.filter(function (d) {
            return  d.time == 'lunch';
          });

        self.dinner_data = self.data.filter(function (d) {
            return  d.time == 'dinner';
          });

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.line = d3.line()
        .x( d => self.xscale(d.year) )
        .y( d => self.yscale(d.rate) );

    }

    update() {
        let self = this;

        self.xscale = d3.scaleLinear()
        .domain([d3.min(self.data, d => d.year), d3.max(self.data, d => d.year)])
        .range([0, self.inner_width]);
  
        self.yscale = d3.scaleLinear()
        .domain([0,d3.max(self.data, d => d.rate) + 2])
        .range([self.inner_height, 0]);

        self.xaxis = d3.axisBottom( self.xscale );
      
        self.yaxis = d3.axisLeft( self.yscale )
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
        .attr('transform', `translate(0, ${self.inner_height})`)
        .call( self.xaxis );
    
        self.yaxis_group = self.chart.append('g')
        .call( self.yaxis );

        self.render();
    }

    render() {
        let self = this;

        const xlabel_space = 40;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('x', self.config.margin.left + self.inner_width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .attr('text-anchor', 'middle')
            .text( self.config.xlabel );

        const ylabel_space = 45;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -self.config.margin.top - self.inner_height / 2)
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.ylabel );

        self.chart.append('path')
        .attr('d', self.line(self.morning_data))
        .attr('stroke', '#ff9900')
        .attr('stroke-width','3')
        .attr('fill', 'none')
        .on('click', function(ev,d) {
            Filter('morning');
        });

        self.chart.append('path')
        .attr('d', self.line(self.lunch_data))
        .attr('stroke', '#0072c6')
        .attr('stroke-width','3')
        .attr('fill', 'none')
        .on('click', function(ev,d) {
            Filter('lunch');
        });

        self.chart.append('path')
        .attr('d', self.line(self.dinner_data))
        .attr('stroke', '#db4437')
        .attr('stroke-width','3')
        .attr('fill', 'none')
        .on('click', function(ev,d) {
            Filter('dinner');
        });

        self.chart.append('rect')
        .attr('x',175)
        .attr('y',0)
        .attr('width',10)
        .attr('height',10)
        .attr('fill','#ff9900');
        self.chart.append('text')
        .style('font-size', '12px')
        .attr('x', 190)
        .attr('y', 10)
        .attr('text-anchor', 'start')
        .text( 'breakfast' );
        self.chart.append('rect')
        .attr('x',245)
        .attr('y',0)
        .attr('width',10)
        .attr('height',10)
        .attr('fill','#0072c6');
        self.chart.append('text')
        .style('font-size', '12px')
        .attr('x', 260)
        .attr('y', 10)
        .attr('text-anchor', 'start')
        .text( 'lunch' );
        self.chart.append('rect')
        .attr('x',290)
        .attr('y',0)
        .attr('width',10)
        .attr('height',10)
        .attr('fill','#db4437');
        self.chart.append('text')
        .style('font-size', '12px')
        .attr('x', 305)
        .attr('y', 10)
        .attr('text-anchor', 'start')
        .text( 'dinner' );
    }
}