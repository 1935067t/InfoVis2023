class SubChart {

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

        self.time = self.data.filter(function (d) {
            return  d.time == 'morning';
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

        self.ylabel = "breakfast skipping [%]"

    }

    update() {
        let self = this;

        self.man_data = self.time.filter(function (d) {
            return  d.gender == 'man';
          });
        self.woman_data = self.time.filter(function (d) {
            return  d.gender == 'woman';
          });

        self.xscale = d3.scaleLinear()
        .domain([d3.min(self.data, d => d.year), d3.max(self.data, d => d.year)])
        .range([0, self.inner_width]);
  
        self.yscale = d3.scaleLinear()
        .domain([0,d3.max(self.time, d => d.rate) + 2])
        .range([self.inner_height, 0]);

        self.xaxis = d3.axisBottom( self.xscale );
      
        self.yaxis = d3.axisLeft( self.yscale )
            .tickSizeOuter(0);

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("g").remove();
        self.chart.selectAll("path").remove();
        self.svg.selectAll("text").remove();

        const xlabel_space = 40;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('x', self.config.width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .text( self.config.xlabel );

        const ylabel_space = 50;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -(self.config.height / 2))
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.ylabel );

        self.xaxis_group = self.chart.append('g')
        .attr('transform', `translate(0, ${self.inner_height})`)
        .call( self.xaxis );
    
        self.yaxis_group = self.chart.append('g')
        .call( self.yaxis );

        self.chart.append('path')
        .attr('d', self.line(self.man_data))
        .attr('stroke', 'blue')
        .attr('stroke-width','3')
        .attr('fill', 'none');

        self.chart.append('path')
        .attr('d', self.line(self.woman_data))
        .attr('stroke', 'red')
        .attr('stroke-width','3')
        .attr('fill', 'none');
        
        self.chart.append('rect')
        .attr('x',245)
        .attr('y',0)
        .attr('width',10)
        .attr('height',10)
        .attr('fill','blue');
        self.chart.append('text')
        .style('font-size', '12px')
        .attr('x', 260)
        .attr('y', 10)
        .attr('text-anchor', 'start')
        .text( 'man' );

        self.chart.append('rect')
        .attr('x',295)
        .attr('y',0)
        .attr('width',10)
        .attr('height',10)
        .attr('fill','red');
        self.chart.append('text')
        .style('font-size', '12px')
        .attr('x', 310)
        .attr('y', 10)
        .attr('text-anchor', 'start')
        .text( 'woman' );

        
    }

    filter(time) {
        let self = this;
        switch(time){
            case 'morning':
                self.time = self.data.filter(function (d) {
                    return  d.time == 'morning';
                  });
                  self.ylabel = "breakfast skipping[%]"
                break;
            case 'lunch':
                self.time = self.data.filter(function (d) {
                    return  d.time == 'lunch';
                  });
                  self.ylabel = "lunch skipping[%]"
                break;
            case 'dinner':
                self.time = self.data.filter(function (d) {
                    return  d.time == 'dinner';
                  });
                  self.ylabel = "dinner skipping[%]"
                break;
            default:
                self.time = self.data.filter(function (d) {
                    return  d.time == 'morning';
                  });
                  self.ylabel = "breakfast skipping [%]"
                break;
        }
    }
}