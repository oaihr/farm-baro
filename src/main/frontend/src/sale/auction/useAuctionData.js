import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuctionData = (filter, status, currentPage = 0) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 경매 상태와 필터에 따라 API URL을 동적으로 생성
                const response = await axios.get(
                    `/api/auction?page=${currentPage}` +
                    (filter !== '' ? `&kind=${filter}` : '') +
                    (status !== '' ? `&status=${status}` : '')
                );
                setData(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (e) {
                console.error("API 호출 실패:", e);
                setData([]);
            }
            setLoading(false);
        };

        fetchData();
    }, [currentPage, filter, status]);

    return { data, loading, totalPages };
};
