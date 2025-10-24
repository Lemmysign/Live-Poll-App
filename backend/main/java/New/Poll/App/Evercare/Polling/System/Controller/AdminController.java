package New.Poll.App.Evercare.Polling.System.Controller;

import New.Poll.App.Evercare.Polling.System.Service.AdminService;
import New.Poll.App.Evercare.Polling.System.DTO.AdminLoginRequest;
import New.Poll.App.Evercare.Polling.System.DTO.AdminResponse;
import New.Poll.App.Evercare.Polling.System.Exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody AdminLoginRequest loginRequest,
                                                     HttpServletRequest request) {
        try {
            // Invalidate old session if exists
            HttpSession oldSession = request.getSession(false);
            if (oldSession != null) {
                oldSession.invalidate();
            }

            // Authenticate admin
            AdminResponse admin = adminService.login(loginRequest);

            // Create new session and store admin details
            HttpSession newSession = request.getSession(true);
            newSession.setAttribute("adminId", admin.getId());
            newSession.setAttribute("adminUsername", admin.getUsername());
            newSession.setMaxInactiveInterval(3600); // 1 hour

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("data", new HashMap<String, Object>() {{
                put("id", admin.getId());
                put("username", admin.getUsername());
            }});

            return ResponseEntity.ok(response);

        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletRequest request) {
        try {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Logged out successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @GetMapping("/current")
    public ResponseEntity<Map<String, Object>> getCurrentAdmin(HttpServletRequest request) {
        try {
            HttpSession session = request.getSession(false);

            if (session == null || session.getAttribute("adminId") == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "error", "Not authenticated"));
            }

            Long adminId = (Long) session.getAttribute("adminId");
            AdminResponse admin = adminService.getAdminById(adminId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", new HashMap<String, Object>() {{
                put("id", admin.getId());
                put("username", admin.getUsername());
            }});

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @GetMapping("/details/{adminId}")
    public ResponseEntity<Map<String, Object>> getAdminDetails(@PathVariable Long adminId,
                                                               HttpServletRequest request) {
        try {
            HttpSession session = request.getSession(false);

            if (session == null || session.getAttribute("adminId") == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "error", "Not authenticated"));
            }

            Long sessionAdminId = (Long) session.getAttribute("adminId");

            // Admin can only view their own details or be authorized to view others
            if (!sessionAdminId.equals(adminId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("success", false, "error", "You can only view your own details"));
            }

            AdminResponse admin = adminService.getAdminById(adminId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", new HashMap<String, Object>() {{
                put("id", admin.getId());
                put("username", admin.getUsername());
            }});

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/check-session")
    public ResponseEntity<Map<String, Object>> checkSession(HttpServletRequest request) {
        try {
            HttpSession session = request.getSession(false);

            if (session == null || session.getAttribute("adminId") == null) {
                return ResponseEntity.ok(Map.of("authenticated", false));
            }

            return ResponseEntity.ok(Map.of(
                    "authenticated", true,
                    "adminId", session.getAttribute("adminId"),
                    "adminUsername", session.getAttribute("adminUsername")
            ));

        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }
    }
}