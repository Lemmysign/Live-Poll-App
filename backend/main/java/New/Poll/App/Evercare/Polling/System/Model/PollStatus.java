package New.Poll.App.Evercare.Polling.System.Model;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "poll_statuses")
public class PollStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; // ACTIVE, STOPPED, COMPLETED

    @Column(nullable = false)
    private String description;

    public PollStatus() {
    }

    public PollStatus(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public PollStatus(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PollStatus that = (PollStatus) o;
        return Objects.equals(id, that.id) && Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    @Override
    public String toString() {
        return "PollStatus{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }

    public static PollStatusBuilder builder() {
        return new PollStatusBuilder();
    }

    public static class PollStatusBuilder {
        private Long id;
        private String name;
        private String description;

        public PollStatusBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PollStatusBuilder name(String name) {
            this.name = name;
            return this;
        }

        public PollStatusBuilder description(String description) {
            this.description = description;
            return this;
        }

        public PollStatus build() {
            return new PollStatus(id, name, description);
        }
    }
}