package New.Poll.App.Evercare.Polling.System.DTO;

public class ChartTypeDto {
    private Long id;
    private String name;
    private String description;

    public ChartTypeDto() {}

    public ChartTypeDto(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}