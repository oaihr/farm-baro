import { createSlice } from "@reduxjs/toolkit";


let quoteSlice = createSlice({
    name : "quote",
    initialState : {

    },
    reducers : {
        saveQuoteInfo(state, action) {

        }
    }
})

export let { saveQuoteInfo } = quoteSlice.actions;

export default quoteSlice;
