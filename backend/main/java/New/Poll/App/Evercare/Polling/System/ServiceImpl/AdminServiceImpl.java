package New.Poll.App.Evercare.Polling.System.ServiceImpl;

import New.Poll.App.Evercare.Polling.System.Service.AdminService;
import New.Poll.App.Evercare.Polling.System.Model.Admin;
import New.Poll.App.Evercare.Polling.System.Repository.AdminRepository;
import New.Poll.App.Evercare.Polling.System.Service.AdminService;
import New.Poll.App.Evercare.Polling.System.DTO.AdminLoginRequest;
import New.Poll.App.Evercare.Polling.System.DTO.AdminResponse;
import New.Poll.App.Evercare.Polling.System.Exception.ResourceNotFoundException;
import New.Poll.App.Evercare.Polling.System.Exception.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AdminResponse login(AdminLoginRequest loginRequest) {
        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Username: " + loginRequest.getUsername());
        System.out.println("Password: " + loginRequest.getPassword());

        Admin admin = adminRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> {
                    System.out.println("❌ Admin not found!");
                    return new UnauthorizedException("Invalid username or password");
                });

        System.out.println("✅ Admin found!");
        System.out.println("Stored password: " + admin.getPassword());
        System.out.println("Starts with $2a$: " + admin.getPassword().startsWith("$2a$"));
        System.out.println("Starts with $2b$: " + admin.getPassword().startsWith("$2b$"));

        // Check if password is plain text (not hashed)
        if (!admin.getPassword().startsWith("$2a$") && !admin.getPassword().startsWith("$2b$")) {
            System.out.println("Password is plain text, comparing...");
            System.out.println("Stored: '" + admin.getPassword() + "'");
            System.out.println("Provided: '" + loginRequest.getPassword() + "'");
            System.out.println("Match: " + admin.getPassword().equals(loginRequest.getPassword()));

            if (admin.getPassword().equals(loginRequest.getPassword())) {
                System.out.println("✅ Password matched! Hashing and saving...");
                admin.setPassword(passwordEncoder.encode(loginRequest.getPassword()));
                adminRepository.save(admin);
                System.out.println("✅ Password hashed and saved!");
            } else {
                System.out.println("❌ Password mismatch!");
                throw new UnauthorizedException("Invalid username or password");
            }
        } else {
            System.out.println("Password is already hashed, verifying...");
            if (!passwordEncoder.matches(loginRequest.getPassword(), admin.getPassword())) {
                System.out.println("❌ Hashed password verification failed!");
                throw new UnauthorizedException("Invalid username or password");
            }
        }

        System.out.println("✅ LOGIN SUCCESSFUL!");
        return new AdminResponse(admin.getId(), admin.getUsername());
    }

    @Override
    public AdminResponse getAdminById(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + id));

        return new AdminResponse(admin.getId(), admin.getUsername());
    }

    @Override
    public void createAdmin(String username, String plainPassword) {
        // Check if admin already exists
        if (adminRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Admin with username '" + username + "' already exists");
        }

        String hashedPassword = passwordEncoder.encode(plainPassword);

        Admin admin = Admin.builder()
                .username(username)
                .password(hashedPassword)
                .build();

        adminRepository.save(admin);
        System.out.println("Admin created with username: " + username);
    }
}