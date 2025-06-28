class ReviewsFilter extends React.Component {
    constructor(props) {
        super(props);
        const container = document.getElementById('feedback_counts');
        this.minLimit = Number(container.dataset.minReviews);
        this.maxLimit = Number(container.dataset.maxReviews);

        const urlParams = new URLSearchParams(window.location.search);
        const currentMin = urlParams.get('min_feedback_counts');

        const initialMin = currentMin ? Number(currentMin) : 0;

        this.state = {
            minReviews: initialMin,
        };
    }

    handleMinChange = (e) => {
        const value = Number(e.target.value);
        this.setState({ minReviews: value });
    };
    
    handleMouseUp = () => {
        this.applyFilter(this.state.minReviews);
    };

    applyFilter = (min) => {
        const url = new URL(window.location.href);
        if (min > 0) {
            url.searchParams.set('min_feedback_counts', min);
        } else {
            url.searchParams.delete('min_feedback_counts');
        }
        url.searchParams.set('page', 1);
        
        const event = new Event('filterChanged');
        window.dispatchEvent(event);
        
        window.location.href = url.toString();
    };

    render() {
        const { minReviews } = this.state;
        const { minLimit, maxLimit } = this;

        return (
            <div style={{ padding: '10px', border: '1px solid #ccc', margin: '10px 0' }}>
                отзывы
                <div>
                    <input
                        type="range"
                        min={minLimit}
                        max={maxLimit}
                        step="100"
                        value={minReviews}
                        onChange={this.handleMinChange}
                        onMouseUp={this.handleMouseUp}
                    />
                </div>
                <div>
                    От {minReviews}
                </div>
            </div>
        );
    }
}

ReactDOM.render(<ReviewsFilter />, document.getElementById('feedback_counts'));