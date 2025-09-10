package com.app.mapper;

import com.app.dto.ProductDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ProductMapper {
    
    // 판매자별 상품 목록 조회
    List<ProductDto> getProductsBySeller(@Param("sellerId") String sellerId);
    
    // 상품 상세 조회
    ProductDto getProductById(@Param("productId") Long productId);
    
    // 상품 등록
    int insertProduct(ProductDto product);
    
    // 상품 수정
    int updateProduct(ProductDto product);
    
    // 상품 삭제
    int deleteProduct(@Param("productId") Long productId);
    
    // 상품 검색 (이름, 카테고리)
    List<ProductDto> searchProducts(@Param("sellerId") String sellerId, 
                                   @Param("productName") String productName,
                                   @Param("productType") String productType);
    
    // 상품 이미지 URL 조회
    List<String> getProductImages(@Param("productId") Long productId);
    
    // 상품 이미지 등록
    int insertProductImage(@Param("productId") Long productId, 
                          @Param("imageUrl") String imageUrl,
                          @Param("orderIndex") Integer orderIndex,
                          @Param("isThumbnail") Boolean isThumbnail);
    
    // 상품 이미지 삭제
    int deleteProductImages(@Param("productId") Long productId);
    
    // 리뷰 이미지 등록
    int insertReviewImage(@Param("reviewId") Long reviewId, 
                         @Param("imageUrl") String imageUrl,
                         @Param("orderIndex") Integer orderIndex,
                         @Param("isThumbnail") Boolean isThumbnail);
    
    // 리뷰 이미지 조회
    List<String> getReviewImages(@Param("reviewId") Long reviewId);
    
    // 리뷰 이미지 삭제
    int deleteReviewImages(@Param("reviewId") Long reviewId);
}
