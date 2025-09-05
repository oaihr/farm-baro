import { configureStore, createSlice } from '@reduxjs/toolkit';


const meatSlice = createSlice({
    name: 'meat',
    initialState: {
    kindNames: {
      'beef': '소',
      'chicken': '닭',
      'pork': '돼지',
    },
    partNames: {
      'sirloin': '등심',
      'tenderloin': '안심',
      'rib': '갈비',
      'belly': '삼겹살',
      'neck': '목살',
      'breast': '가슴살',
      'leg': '다리살',
      'etc': '기타',
    },
  },
  reducers: {
    
  },
});

export const store = configureStore({
    reducer:{
        meat: meatSlice.reducer,
    },
})