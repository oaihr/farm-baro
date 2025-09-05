import { useState, useEffect } from 'react';

const useRemainingTime = (endDateValue) => {
    const [remainingTime, setRemainingTime] = useState(null);

    useEffect(() => {

        if (!endDateValue) {
            setRemainingTime("종료된 경매");
            return;
        }

        const endDate = new Date(endDateValue);
        
        // 날짜 파싱이 실패했는지 확인 (유효하지 않은 날짜 포맷일 경우)
        if (isNaN(endDate.getTime())) {
            setRemainingTime("유효하지 않은 날짜");
            return;
        }

        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = endDate.getTime() - now.getTime();

            if (difference <= 0) {
                setRemainingTime("종료");
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                const formatNumber = (num) => num < 10 ? String(num) : String(num).padStart(2, '0');

                setRemainingTime(`${days === 0 ? '' : days + '일 '} ${formatNumber(hours)}시간 ${formatNumber(minutes)}분 ${formatNumber(seconds)}초`);
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [endDateValue]);

    return remainingTime;
};

export default useRemainingTime;