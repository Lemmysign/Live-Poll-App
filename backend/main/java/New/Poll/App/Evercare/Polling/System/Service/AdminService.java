package New.Poll.App.Evercare.Polling.System.Service;

import New.Poll.App.Evercare.Polling.System.DTO.AdminLoginRequest;
import New.Poll.App.Evercare.Polling.System.DTO.AdminResponse;

public interface AdminService {
    AdminResponse login(AdminLoginRequest loginRequest);
    AdminResponse getAdminById(Long id);
    void createAdmin(String username, String plainPassword);
}