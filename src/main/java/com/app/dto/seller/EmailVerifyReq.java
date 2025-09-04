package com.app.dto.seller;
import lombok.Data;

@Data
public class EmailVerifyReq {
  private String email;
  private String code;
}
