package New.Poll.App.Evercare.Polling.System.Model;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "chart_types")
public class ChartType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; // PIE, BAR

    @Column(nullable = false)
    private String description;

    public ChartType() {
    }

    public ChartType(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public ChartType(Long id, String name, String description) {
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
        ChartType chartType = (ChartType) o;
        return Objects.equals(id, chartType.id) && Objects.equals(name, chartType.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    @Override
    public String toString() {
        return "ChartType{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }

    public static ChartTypeBuilder builder() {
        return new ChartTypeBuilder();
    }

    public static class ChartTypeBuilder {
        private Long id;
        private String name;
        private String description;

        public ChartTypeBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ChartTypeBuilder name(String name) {
            this.name = name;
            return this;
        }

        public ChartTypeBuilder description(String description) {
            this.description = description;
            return this;
        }

        public ChartType build() {
            return new ChartType(id, name, description);
        }
    }
}