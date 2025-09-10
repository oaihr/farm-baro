import './PageNation.css';
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';


function PageNation({ totalItems, itemCountPerPage, pageCount, currentPage, type }) {

    const totalPages = Math.ceil(totalItems / itemCountPerPage);
    const [start, setStart] = useState(1);
    const noPrev = start === 1;
    const noNext = start + pageCount - 1 >= totalPages;

    useEffect(() => {
        if (currentPage === start + pageCount) setStart((prev) => prev + pageCount);
        if (currentPage < start) setStart((prev) => prev - pageCount);
    }, [currentPage, pageCount, start]);

    if (totalItems <= itemCountPerPage) {
        return null;
    }

    return (
        <div className="pageN-wrapper">
            <ul className='pageN-ul'>
                <li className={`pageN-move ${noPrev && "pageN-invisible"}`}>
                    <Link to={`?${type}page=${start - 1}`}>이전</Link>
                </li>
                {[...Array(pageCount)].map((a, i) => (
                    <li key={i}>
                        {start + i <= totalPages && (
                            <Link className={`pageN-page ${currentPage === start + i && "pageN-active"}`}
                                to={`?${type}page=${start + i}`}>
                                {start + i}
                            </Link>
                        )}
                    </li>
                ))}
                <li className={`pageN-move ${noNext && "pageN-invisible"}`}>
                    <Link to={`?${type}page=${start + pageCount}`}>다음</Link>
                </li>
            </ul>
        </div>
    );
}

export default PageNation;