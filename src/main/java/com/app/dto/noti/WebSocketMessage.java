package com.app.dto.noti;

import lombok.Data;
@Data
public class WebSocketMessage {
    private String type;
    private String message;
    private Integer relatedId;
    private Integer bidPrice;

    public WebSocketMessage(String type, String message, Integer relatedId, Integer bidPrice) {
        this.type = type;
        this.message = message;
        this.relatedId = relatedId;
        this.bidPrice = bidPrice;
    }
}