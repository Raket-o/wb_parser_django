const SortingComponent = () => {
    const urlParams = new URLSearchParams(window.location.search);

    const [sortBy, setSortBy] = React.useState(urlParams.get('order_by') || '');
    const [sortOrder, setSortOrder] = React.useState(urlParams.get('sort_order') || 'asc');

    const page = urlParams.get('page') || 1;
    const priceMin = urlParams.get('price_min');
    const priceMax = urlParams.get('price_max');
    const ratingMin = urlParams.get('rating_min');

    const handleSort = (field) => {
        let newSortOrder = 'asc';
        if (sortBy === field) {
            newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        }

        setSortBy(field);
        setSortOrder(newSortOrder);

        let newUrl = `?page=${page}`;
        if (priceMin) newUrl += `&price_min=${priceMin}`;
        if (priceMax) newUrl += `&price_max=${priceMax}`;
        if (ratingMin) newUrl += `&rating_min=${ratingMin}`;
        newUrl += `&order_by=${field}&sort_order=${newSortOrder}`;

        window.location.href = newUrl;
    };

    const renderSortIndicator = (field) => {
        if (sortBy !== field) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    return (
        <div>
            <button
                style={{margin: '10px'}}
                onClick={() => handleSort('name')}
                className={`btn btn-warning ${sortBy === 'name' ? 'active' : ''}`}
            >
                По названию {renderSortIndicator('name')}
            </button>
            <button
                style={{margin_left: '10px'}}
                onClick={() => handleSort('price')}
                className={`btn btn-warning ${sortBy === 'price' ? 'active' : ''}`}
            >
                По цене {renderSortIndicator('price')}
            </button>
            <button
                style={{margin: '10px'}}
                onClick={() => handleSort('rating')}
                className={`btn btn-warning ${sortBy === 'rating' ? 'active' : ''}`}
            >
                По рейтингу {renderSortIndicator('rating')}
            </button>
            <button
                style={{margin_left: '10px'}}
                onClick={() => handleSort('feedback_counts')}
                className={`btn btn-warning ${sortBy === 'feedback_counts' ? 'active' : ''}`}
            >
                По отзывам {renderSortIndicator('feedback_counts')}
            </button>
        </div>
    );
};


const sortingContainer = document.getElementById('sorting-container');
if (sortingContainer) {
    ReactDOM.render(<SortingComponent />, sortingContainer);
}
const event = new Event('filterChanged');
window.dispatchEvent(event);