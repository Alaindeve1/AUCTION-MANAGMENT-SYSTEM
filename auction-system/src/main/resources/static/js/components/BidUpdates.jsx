import React from 'react';
import { useBidUpdates } from '../hooks/useBidUpdates';

export const BidUpdates = ({ itemId }) => {
    const { bids, error, placeBid, connected } = useBidUpdates(itemId);
    const [bidAmount, setBidAmount] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const amount = parseFloat(bidAmount);
        if (!isNaN(amount) && amount > 0) {
            placeBid(amount);
            setBidAmount('');
        }
    };

    if (!connected) {
        return <div>Connecting to WebSocket...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="bid-updates">
            <h3>Bid Updates</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter bid amount"
                    min="0"
                    step="0.01"
                    required
                />
                <button type="submit">Place Bid</button>
            </form>
            <div className="bid-list">
                {bids.map((bid, index) => (
                    <div key={index} className="bid-item">
                        <p>
                            <strong>{bid.bidderName}</strong> placed a bid of{' '}
                            <strong>${bid.amount}</strong>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}; 