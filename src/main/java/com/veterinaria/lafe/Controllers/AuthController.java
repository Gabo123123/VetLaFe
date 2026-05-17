package com.veterinaria.lafe.Controllers;

import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        String email = request.get("email");
        
        if (username == null || username.trim().isEmpty() || 
            password == null || password.trim().isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Usuario y contraseña son requeridos");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Por ahora solo retornamos un mensaje de éxito
        // En una aplicación real, aquí guardarías el usuario en la BD
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Usuario registrado exitosamente");
        response.put("username", username);
        response.put("email", email != null ? email : "");
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("username", authentication.getName());
            response.put("message", "Login exitoso");
            return ResponseEntity.ok(response);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Credenciales inválidas");
        return ResponseEntity.status(401).body(response);
    }
    
    @GetMapping("/user")
    public ResponseEntity<Map<String, String>> getCurrentUser(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            Map<String, String> user = new HashMap<>();
            user.put("username", authentication.getName());
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).build();
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logout exitoso");
        return ResponseEntity.ok(response);
    }
}
