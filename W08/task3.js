d3.csv("https://1935067t.github.io/InfoVis2023/W04/w04_task2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256
        };

        const pie_chart = new PieChart( config, data );
        pie_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class PieChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height)
            .append('g')
            .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);
        
        self.radius = Math.min( self.config.width, self.config.height ) / 2;

        self.pie = d3.pie()
                    .value(d => d.length)
                    .sort(null);

        self.arc = d3.arc()
                    .innerRadius(0)
                    .outerRadius(self.radius);

        self.text = d3.arc()
                        .outerRadius(self.radius  -40)
                        .innerRadius(self.radius - 40);

        self.pieChart = self.svg.selectAll(".pie")
        .data(self.pie(self.data))
        .enter()
        .append("g")
        .attr("class", "pie");
    }

    update() {
        let self = this;
        self.render();
    }

    render() {
        let self = this;

        self.pieChart.append("path")
        .attr("d", self.arc)
        .attr('fill', d => d.data.color) //.dataが必要
        .attr('stroke', 'white')
        .style('stroke-width', '2px');

        self.pieChart.append("text")
        .attr("fill", "black")
        .attr("transform", function(d) { return "translate(" + self.text.centroid(d) + ")"; })
        .attr("dy", "5px")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.data.label; });
    }
}
