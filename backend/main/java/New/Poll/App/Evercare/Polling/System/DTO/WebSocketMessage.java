package New.Poll.App.Evercare.Polling.System.DTO;

public class WebSocketMessage {
    private String type;
    private String pollCode;
    private PollResultsDto data;

    public WebSocketMessage() {}

    public WebSocketMessage(String type, String pollCode, PollResultsDto data) {
        this.type = type;
        this.pollCode = pollCode;
        this.data = data;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getPollCode() { return pollCode; }
    public void setPollCode(String pollCode) { this.pollCode = pollCode; }

    public PollResultsDto getData() { return data; }
    public void setData(PollResultsDto data) { this.data = data; }
}
