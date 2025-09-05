import { configureStore } from '@reduxjs/toolkit';
import quoteSlice from '../store/quoteSlice';


// 객체 관리
// 데이터 저장 관련 정보 + getter setter 함수형으로 데이터 관리
//actions : 상태관리하는 변수(slice) 에 속해있는 상태변경 함수들이 모여있는 객체

//store 설정
export default configureStore({
    reducer: {
        quote: quoteSlice.reducer
    }
})