package com.uv.app.controller;

import com.uv.app.service.UserService;
import com.uv.security.generated.app.api.UsersApiController;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;

@RestController
public class UsersController extends UsersApiController {

    private final UserService userService;

    public UsersController(NativeWebRequest request, UserService userService) {
        super(request);
        this.userService = userService;
    }

}
