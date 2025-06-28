class RatingFilter extends React.Component {
    constructor(props) {
        super(props);
        const container = document.getElementById('rating-filter');
        this.minLimit = Number(container.dataset.minRating);
        this.maxLimit = Number(container.dataset.maxRating);

        const urlParams = new URLSearchParams(window.location.search);
        const currentMin = urlParams.get('min_rating');

        const initialMin = currentMin ? Number(currentMin) : this.minLimit;

        this.state = {
            minRating: initialMin,
        };
    }

    handleMinChange = (e) => {
        const value = Number(e.target.value);
        this.setState({ minRating: value });
    };
    
    handleMouseUp = () => {
        this.applyFilter(this.state.minRating);
    };

    applyFilter = (min) => {
        const url = new URL(window.location.href);
        if (min > this.minLimit) {
            url.searchParams.set('min_rating', min);
        } else {
            url.searchParams.delete('min_rating');
        }
        url.searchParams.set('page', 1);
        window.location.href = url.toString();
    };

    render() {
        const { minRating } = this.state;
        const { minLimit, maxLimit } = this;

        return (
            <div style={{ padding: '10px', border: '1px solid #ccc', margin: '10px 0' }}>
                рейтинг
                <div>
                    <input
                        type="range"
                        min={0}
                        max={5}
                        step="0.1"
                        value={minRating}
                        onChange={this.handleMinChange}
                        onMouseUp={this.handleMouseUp}
                    />
                </div>
                <div>
                    От {minRating.toFixed(1)}
                </div>
            </div>
        );
    }
}
ReactDOM.render(<RatingFilter />, document.getElementById('rating-filter'));