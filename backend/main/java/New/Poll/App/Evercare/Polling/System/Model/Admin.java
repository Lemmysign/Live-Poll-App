package New.Poll.App.Evercare.Polling.System.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "admins")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Admin() {
    }

    public Admin(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public Admin(Long id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Admin admin = (Admin) o;
        return Objects.equals(this.id, admin.id) &&
                Objects.equals(this.username, admin.username) &&
                Objects.equals(this.password, admin.password);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id, this.username, this.password);
    }

    @Override
    public String toString() {
        return "Admin{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }

    public static AdminBuilder builder() {
        return new AdminBuilder();
    }

    public static class AdminBuilder {
        private Long id;
        private String username;
        private String password;
        private LocalDateTime createdAt;

        public AdminBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public AdminBuilder username(String username) {
            this.username = username;
            return this;
        }

        public AdminBuilder password(String password) {
            this.password = password;
            return this;
        }

        public AdminBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Admin build() {
            Admin admin = new Admin(this.id, this.username, this.password);
            admin.setCreatedAt(this.createdAt);
            return admin;
        }
    }
}