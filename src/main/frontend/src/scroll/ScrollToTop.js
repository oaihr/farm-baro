// ScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // 경로(pathname)가 바뀔 때마다 스크롤을 최상단으로 이동
        window.scrollTo(0, 0);
    }, [pathname]);

    return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
}

export default ScrollToTop;