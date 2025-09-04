package com.app.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailSendException;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    /* 공통 응답 바디 */
    private ResponseEntity<Map<String,Object>> resp(HttpStatus s, String msg, Map<String,String> errors){
        Map<String,Object> b = new LinkedHashMap<>();
        b.put("ok", false);
        b.put("message", msg);
        if (errors != null && !errors.isEmpty()) b.put("errors", errors);
        return ResponseEntity.status(s).body(b);
    }

    /** @RequestBody + @Valid 실패 / 폼 바인딩 실패 둘 다 처리 */
    @ExceptionHandler({ MethodArgumentNotValidException.class, BindException.class })
    public ResponseEntity<Map<String,Object>> handleBindErrors(Exception ex){
        Map<String,String> errors = new LinkedHashMap<>();
        if (ex instanceof MethodArgumentNotValidException) {
            MethodArgumentNotValidException manve = (MethodArgumentNotValidException) ex;
            for (FieldError fe : manve.getBindingResult().getFieldErrors()) {
                errors.put(fe.getField(), fe.getDefaultMessage());
            }
        } else if (ex instanceof BindException) {
            BindException be = (BindException) ex;
            for (FieldError fe : be.getBindingResult().getFieldErrors()) {
                errors.put(fe.getField(), fe.getDefaultMessage());
            }
        }
        return resp(HttpStatus.BAD_REQUEST, "입력값을 확인해 주세요.", errors);
    }

    /** @RequestParam/@PathVariable 검증 실패 */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String,Object>> handleConstraint(ConstraintViolationException ex){
        Map<String,String> errors = new LinkedHashMap<>();
        for (ConstraintViolation<?> v : ex.getConstraintViolations()){
            String path = v.getPropertyPath().toString();
            String field = path.contains(".") ? path.substring(path.lastIndexOf('.')+1) : path;
            errors.put(field, v.getMessage());
        }
        return resp(HttpStatus.BAD_REQUEST, "입력값을 확인해 주세요.", errors);
    }

    /** 필수 파라미터 누락 */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Map<String,Object>> missingParam(MissingServletRequestParameterException e){
        return resp(HttpStatus.BAD_REQUEST, "필수 파라미터 누락: " + e.getParameterName(), null);
    }

    /** JSON 바디 없음/파싱 불가 */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String,Object>> badJson(HttpMessageNotReadableException e){
        return resp(HttpStatus.BAD_REQUEST, "요청 본문(JSON)을 읽을 수 없습니다.", null);
    }

    /** DB 무결성(중복키 등) → 409 */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String,Object>> conflict(DataIntegrityViolationException e){
        return resp(HttpStatus.CONFLICT, "이미 사용 중인 값이 있습니다.", null);
    }

    /** 비즈니스 오류 → 400 */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String,Object>> badReq(IllegalArgumentException e){
        return resp(HttpStatus.BAD_REQUEST, e.getMessage(), null);
    }
    
    /** 서비스단에서 던진 ResponseStatusException은 reason/상태코드 그대로 노출 */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String,Object>> rse(ResponseStatusException e){
        return resp(e.getStatus(), e.getReason(), null);
    }

    /** SMTP 인증(계정/앱비번/권한) 문제 */
    @ExceptionHandler(MailAuthenticationException.class)
    public ResponseEntity<Map<String,Object>> mailAuth(MailAuthenticationException e){
        String msg = e.getCause()!=null ? e.getCause().getMessage() : e.getMessage();
        return resp(HttpStatus.BAD_GATEWAY, "SMTP 인증 실패: " + msg, null);
    }


    /** SMTP 전송(네트워크/타임아웃/포맷) 문제 */
    @ExceptionHandler(MailSendException.class)
    public ResponseEntity<Map<String,Object>> mailSend(MailSendException e){
        String msg = (e.getMostSpecificCause() != null)
            ? e.getMostSpecificCause().getMessage()
            : e.getMessage();
        return resp(HttpStatus.BAD_GATEWAY, "SMTP 전송 실패: " + msg, null);
    }


    /** 마지막 안전망 → 500 (단 하나만 존재해야 함) */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,Object>> unknown(Exception e){
        // e.printStackTrace(); // 개발 중만
        return resp(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류가 발생했습니다.", null);
    }
}
