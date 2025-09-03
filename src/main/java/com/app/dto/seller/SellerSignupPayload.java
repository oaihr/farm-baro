package com.app.dto.seller;
import lombok.Data;

@Data
public class SellerSignupPayload {
  private Basic basic;
  private Business business;
  private Settlement settlement;

  @Data
  public static class Basic {
    private String name;
    private String email;
    private String pass;
  }

  @Data
  public static class Business {
    private String brn;
    private String sellerType;
    private String repName;
    private String zip;
    private String addr1;
    private String addr2;
    private String traceNo;
  }

  @Data
  public static class Settlement {
    private String accHolder;
    private String bank;
    private String accNo;
  }
}
