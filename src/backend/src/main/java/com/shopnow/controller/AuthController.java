package com.shopnow.controller;

import com.shopnow.auth.JwtTokenProvider;
import com.shopnow.dto.AuthRequest;
import com.shopnow.dto.AuthResponse;
import com.shopnow.dto.RegisterRequest;
import com.shopnow.dto.UserDto;
import com.shopnow.model.User;
import com.shopnow.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtTokenProvider.generateToken(userDetails);

        User user = userService.findByEmail(request.getEmail());
        UserDto userDto = new UserDto(
                user.getId().toString(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName()
        );

        return ResponseEntity.ok(new AuthResponse(token, userDto));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        User user = userService.register(request);
        UserDto userDto = new UserDto(
                user.getId().toString(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName()
        );

        // Generate token for the new user
        UserDetails userDetails = userService.loadUserByUsername(user.getEmail());
        String token = jwtTokenProvider.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(token, userDto));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByEmail(email);
        UserDto userDto = new UserDto(
                user.getId().toString(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName()
        );
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // JWT is stateless, so we don't need to do anything server-side
        // The client should remove the token
        return ResponseEntity.ok().build();
    }
}
