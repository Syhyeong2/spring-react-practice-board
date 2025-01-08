package com.syhy.login_jwt_practice.user;

import lombok.Data;

@Data
public class UserRequestDTO {
    private String username;
    private String password;
}
