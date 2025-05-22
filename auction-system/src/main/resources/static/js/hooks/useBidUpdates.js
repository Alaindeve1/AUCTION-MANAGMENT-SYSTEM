import { useEffect, useState } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

export const useBidUpdates = (itemId) => {
    const { connected, subscribe, send } = useWebSocket();
    const [bids, setBids] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (connected) {
            // Subscribe to general bid updates
            const generalSubscription = subscribe('/topic/bidUpdates', (message) => {
                const bid = JSON.parse(message.body);
                setBids(prev => [...prev, bid]);
            });

            // Subscribe to item-specific bid updates if itemId is provided
            let itemSubscription = null;
            if (itemId) {
                itemSubscription = subscribe(`/topic/bid/${itemId}`, (message) => {
                    const bid = JSON.parse(message.body);
                    setBids(prev => [...prev, bid]);
                });
            }

            return () => {
                if (generalSubscription) {
                    generalSubscription.unsubscribe();
                }
                if (itemSubscription) {
                    itemSubscription.unsubscribe();
                }
            };
        }
    }, [connected, subscribe, itemId]);

    const placeBid = (amount) => {
        try {
            if (itemId) {
                send(`/app/bid/${itemId}`, {
                    itemId,
                    amount
                });
            } else {
                send('/app/placeBid', {
                    amount
                });
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return {
        bids,
        error,
        placeBid,
        connected
    };
}; 