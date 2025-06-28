class PriceFilter extends React.Component {
    constructor(props) {
        super(props);
        const container = document.getElementById('price-filter');
        this.minLimit = Number(container.dataset.minPrice);
        this.maxLimit = Number(container.dataset.maxPrice);

        const urlParams = new URLSearchParams(window.location.search);
        const currentMin = urlParams.get('min_price');
        const currentMax = urlParams.get('max_price');

        const initialMin = currentMin ? Number(currentMin) : this.minLimit;
        const initialMax = currentMax ? Number(currentMax) : this.maxLimit;

        this.state = {
            minPrice: initialMin,
            maxPrice: initialMax,
        };
    }

    handleMinChange = (e) => {
        const value = Number(e.target.value);
        if (value < this.state.maxPrice) {
            this.setState({ minPrice: value });
        }
    };

    handleMaxChange = (e) => {
        const value = Number(e.target.value);
        if (value > this.state.minPrice) {
            this.setState({ maxPrice: value });
        }
    };
    
    handleMouseUp = () => {
        this.applyFilter(this.state.minPrice, this.state.maxPrice);
    };

    applyFilter = (min, max) => {
        const url = new URL(window.location.href);
        url.searchParams.set('min_price', min);
        url.searchParams.set('max_price', max);
        url.searchParams.set('page', 1);
        
        const event = new Event('filterChanged');
        window.dispatchEvent(event);
        
        window.location.href = url.toString();
    };

    render() {
        const { minPrice, maxPrice } = this.state;
        const { minLimit, maxLimit } = this;

        const left = ((minPrice - minLimit) / (maxLimit - minLimit)) * 100;
        const width = ((maxPrice - minPrice) / (maxLimit - minLimit)) * 100;

        return (
            <div style={{ padding: '10px', border: '1px solid #ccc', margin: '10px 0' }}>
                цена
                <div>
                    <div style={{ left: `${left}%`, width: `${width}%` }}></div>

                    <input
                        type="range"
                        min={minLimit}
                        max={maxLimit}
                        value={minPrice}
                        onChange={this.handleMinChange}
                        onMouseUp={this.handleMouseUp}
                    />
                    <input
                        type="range"
                        min={minLimit}
                        max={maxLimit}
                        value={maxPrice}
                        onChange={this.handleMaxChange}
                        onMouseUp={this.handleMouseUp}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <span>{minPrice}</span>
                    <span>{maxPrice}</span>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<PriceFilter />, document.getElementById('price-filter'));