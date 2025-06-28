const divName = {
    display: "flex",
    alignItems: "center",
    color: "#666666",
    justifyContent: "center",
    fontSize: "12px",

};
class LinearChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true
        };
        this.chartRef = React.createRef();
        this.chartInstance = null;
    }

    componentDidMount() {
        this.fetchData();
        window.addEventListener('filterChanged', this.fetchData);
    }

    componentWillUnmount() {
        window.removeEventListener('filterChanged', this.fetchData);
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
    }


    fetchData = () => {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        
        this.setState({ loading: true });
        
        fetch(`/api/products/?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                const processedData = this.processData(data.results || data);
                this.setState({ data: processedData, loading: false }, this.renderChart);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                this.setState({ loading: false });
            });
    };

    processData = (products) => {
        return products.map(product => ({
            rating: product.rating,
            discount: ((product.price - product.discount_price) / product.price * 100).toFixed(2)
        })).sort((a, b) => a.rating - b.rating);
    };

    renderChart = () => {
        const { data } = this.state;
        const ctx = this.chartRef.current.getContext('2d');
        
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => item.rating),
                datasets: [{
                    label: 'Размер скидки (%)',
                    data: data.map(item => item.discount),
                    fill: true,
                    lineTension: 0.5,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                        }
                    },
                    y: {
                        title: {
                            display: true,
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Скидка: ${context.parsed.y}%`;
                            },
                            afterLabel: function(context) {
                                return `Рейтинг: ${context.label}`;
                            }
                        }
                    }
                }
            }
        });
    };

    render() {
        const { loading } = this.state;
        
        return (
            <div>
                <div style={divName}>
                    Размер скидки на товар vs рейтинг товара
                </div>
                {loading ? (
                    <div>Загрузка данных...</div>
                ) : (
                    <div style={{ position: 'relative', height: '200px' }}>
                        <canvas ref={this.chartRef} width="500" height="200"></canvas>
                    </div>
                )}
            </div>
        );
    }
}

ReactDOM.render(<LinearChart />, document.querySelector('.linear_graph'));