package com.example.wonit.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

// 라우팅 기능: 사용자의 요청(Request)을 주소줄과 매핑해서 서버에 전달하는 역할
@RestController
@RequestMapping("/hello")  // localhost:8080/hello
public class HelloController {

    // application.yml 에 들에었는 app.title 의 속성값을 가져와서 bean에 등록
    @Value("${app.title}")
    private String appTitle;

    @GetMapping
    public String sayHello() {
        return "Hello, Spring Boot!" + appTitle;
    }

//    @GetMapping("/{path}")  // localhost:8080/hello/경로변수(PathVarible)
//    public String sayHello(@PathVariable String path) {
//        return "Hello, Spring Boot!" + path;
//    }

//    @GetMapping // localhost:8080/hello?name=값
//    public String sayHello(@RequestParam(value="name") String name) {
//        return "Hello, Spring Boot!" + name;
//    }

    @GetMapping("/{path}") // localhost:8080/hello/path?name=값&footSize=250
    // 2번째 RequestParam으로 footSize를 받아서 Hello, Spring Boot!
    // 나는 이름, 신발사이즈는 250    // 없으면 안 들어옴2
    public String sayHello(@PathVariable String path,
                           @RequestParam(value="name", defaultValue = "안 들어옴") String name,
                           @RequestParam(value="footSize", defaultValue = "안 들어옴2") String foot) {
        return "Hello, Spring Boot! " + path + " "+ name + " 신발사이즈는 " + foot;
    }

    // 🍪 쿠키 실습: localhost:8080/hello/cookie 를 두 번 열어 보자
    // @CookieValue(name = "snack", required = false) String snack, 브라우저의 현재 사이트 쿠키 중에 snack이라는 값을 찾겠음
    @GetMapping("/cookie")
    public String cookie(@CookieValue(name = "snack", required = false) String snack,
                         @RequestParam(name = "input", required = false) String input,
                         HttpServletResponse response) {
        if (snack == null) {                                     // 처음 온 손님
            Cookie cookie = new Cookie("snack", input);
            cookie.setPath("/");
            cookie.setMaxAge(30); // 넣기 전에 셋팅을 하고 넣어줍니다.
            response.addCookie(cookie);  //30초짜리 쿠기를 하나 만들고 넣어서 응답에 Set-Cookie: snack=choco 를 싣는다

            return "쿠키가 없어서 하나 줬습니다. 새로고침해 보세요";
        }
        return "브라우저가 쿠키를 들고 왔습니다: snack=" + snack;   // 다음부터는 브라우저가 알아서 보낸다
    }

    // 🍪 쿠키 지우기: 서버는 브라우저의 쿠키를 직접 못 지운다 → "수명 0" 짜리로 덮어쓰게 한다
    @GetMapping("/cookie/delete")
    public String deleteCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("snack", "");
        cookie.setPath("/");          // 🚨 만들 때와 path 가 같아야 같은 쿠키로 본다 (빼면 안 지워진다)
        cookie.setMaxAge(0);          // 수명 0 → 브라우저가 바로 지운다
        response.addCookie(cookie);
        return "쿠키를 지웠습니다. /hello/cookie 를 다시 열어 보세요";
    }
}
