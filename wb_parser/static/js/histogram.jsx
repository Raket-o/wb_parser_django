class Histogram extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            priceRanges: [
                { min: 0, max: 1000, label: "0-1000" },
                { min: 1001, max: 2000, label: "1001-2000" },
                { min: 2001, max: 3000, label: "2001-3000" },
                { min: 3001, max: 4000, label: "3001-4000" },
                { min: 4001, max: 5000, label: "4001-5000" },
                { min: 5001, max: 10000, label: "5001-10000" }
            ]
        };
        this.chartRef = React.createRef();
        this.chart = null;
    }

    componentDidMount() {
        this.fetchData();
        window.addEventListener('filterChanged', this.handleFilterChange);
    }

    componentWillUnmount() {
        window.removeEventListener('filterChanged', this.handleFilterChange);
        if (this.chart) {
            this.chart.destroy();
        }
    }

    handleFilterChange = () => {
        this.fetchData();
    }

    fetchData() {
        const params = new URLSearchParams(window.location.search);

        params.delete('page');

        fetch(`/api/histogram/?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                this.setState({ data, loading: false }, this.renderChart);
            })
            .catch(error => {
                console.error('Error fetching histogram data:', error);
                this.setState({ loading: false });
            });
    }


    renderChart() {
        const { data, priceRanges } = this.state;
        const labels = priceRanges.map(range => range.label);
        const counts = priceRanges.map(range => {
            const found = data.find(item => item.range === range.label);
            return found ? found.count : 0;
        });

        const ctx = this.chartRef.current.getContext('2d');

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'шт',
                    data: counts,
                    fill: true,
                    lineTension: 0.5,
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false
                },
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Распределение цены vs количество товаров'
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                        }
                    },
                    x: {
                        title: {
                            display: true,
                        }
                    }
                }
            }
        });
    }

    render() {
        return (
            <div>
                {this.state.loading ? (
                    <p>Загрузка данных...</p>
                ) : (
                    <canvas ref={this.chartRef} width="500" height="200"></canvas>
                )}
            </div>
        );
    }
}

const histogramContainer = document.querySelector('.grafics_histogram');
if (histogramContainer) {
    ReactDOM.render(<Histogram />, histogramContainer);
}
