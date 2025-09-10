import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../services/useWebSocket';

const AuctionPage = ({ auctionId }) => {
    const [currentBid, setCurrentBid] = useState(0);
    const { isConnected, subscribe } = useWebSocket();

    useEffect(() => {
        let subscription;
        if (isConnected && auctionId) {
            subscription = subscribe(`/topic/auction/${auctionId}`, (data) => {
                console.log('Received bid update:', data);
                setCurrentBid(data.bidPrice);
            });
        }

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [isConnected, auctionId, subscribe]);

    return (
        <div>
            <h1>실시간 경매</h1>
            <p>
                현재 최고 입찰가: <strong>{currentBid}</strong>
            </p>
        </div>
    );
};

export default AuctionPage;