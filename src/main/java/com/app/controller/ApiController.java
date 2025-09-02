package com.app.controller;

import javax.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

/*test controller*/

@RestController
@RequestMapping("/dev")
public class ApiController {

  @GetMapping({"/ping", "/ping/"})
  public String ping(){ return "pong"; }

  @PostMapping("/login-stub")
  public String loginStub(@RequestParam String email, HttpSession s){
    s.setAttribute("LOGIN_USER_ID", email);
    return "ok";
  }

  @GetMapping("/me")
  public String me(HttpSession s){
	  Object id = s.getAttribute("LOGIN_USER_ID");
	    return (id==null) ? "Not Login" : "login user : " + id;
  }
}
