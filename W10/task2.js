d3.csv("https://1935067t.github.io/InfoVis2023/W10/w10_task2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 500,
            height: 456,
            margin: {top:60, right:40, bottom:50, left:70},
            plotmargin: 30,
            title: "Scatter Plot"
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            plotmargin: config.plotmargin || 10,
            title: config.title || "title"
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
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height,0] );

        self.title_cx = self.config.margin.left + self.inner_width / 2;
        self.title_cy = self.config.margin.top / 2;
        self.xrabel_cx = self.config.margin.left + self.inner_width / 2;
        self.xrabel_cy = self.config.height - self.config.margin.bottom /3.5;
        self.yrabel_cx = self.config.margin.left / 2;
        self.yrabel_cy = self.config.margin.top + self.inner_height / 2;

        self.rabelrotate = "rotate(-90,"+self.yrabel_cx+","+self.yrabel_cy+")";

        self.xscatterscale = d3.scaleLinear()
            .range( [self.config.plotmargin,self.inner_width - self.config.plotmargin]);

        self.yscatterscale = d3.scaleLinear()
            .range( [self.inner_height - self.config.plotmargin,self.config.plotmargin]);


        const x_min = d3.min( self.data, d => d.x );
        const x_max = d3.max( self.data, d => d.x );
        const y_min = d3.min( self.data, d => d.y );
        const y_max = d3.max( self.data, d => d.y );
        self.xaxis = d3.axisBottom( self.xscale )
            .tickValues([x_min-self.config.plotmargin, x_max+self.config.plotmargin]);

        self.yaxis = d3.axisLeft( self.yscale )
            .tickValues([y_min-self.config.plotmargin, y_max+self.config.plotmargin]);  

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0,0)`);
    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        self.xscale.domain( [xmin-self.config.plotmargin, xmax+self.config.plotmargin] );
        self.xscatterscale.domain([xmin, xmax]);

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        self.yscale.domain( [ymin-self.config.plotmargin, ymax+self.config.plotmargin] );
        self.yscatterscale.domain([ymin,ymax]);

        self.render();
    }

    render() {
        let self = this;

        self.svg
            .append("text")
            .attr("x", self.title_cx)
            .attr("y", self.title_cy)
            .attr("text-anchor","middle")
            .attr("font-size", "25px")
            .text(self.config.title);

        self.svg
            .append("text")
            .attr("x", self.xrabel_cx)
            .attr("y", self.xrabel_cy)
            .attr("text-anchor","middle")
            .attr("font-size", "15px")
            .text("xaxis");

            self.svg
            .append("text")
            .attr("x", self.yrabel_cx)
            .attr("y", self.yrabel_cy)
            .attr("text-anchor","middle")
            .attr("font-size", "15px")
            .attr("transform",self.rabelrotate)
            .text("yaxis");

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscatterscale( d.x ) )
            .attr("cy", d => self.yscatterscale( d.y ) )
            .attr("r", d => d.r )
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Attribute</div>(${d.attr})`);
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);
            });

        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .call( self.yaxis);

    }
}
