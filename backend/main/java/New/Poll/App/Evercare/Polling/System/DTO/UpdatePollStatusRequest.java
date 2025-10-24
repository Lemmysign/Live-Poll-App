package New.Poll.App.Evercare.Polling.System.DTO;

public class UpdatePollStatusRequest {
    private Long pollId;
    private Long pollStatusId;

    public UpdatePollStatusRequest() {}

    public Long getPollId() { return pollId; }
    public void setPollId(Long pollId) { this.pollId = pollId; }

    public Long getPollStatusId() { return pollStatusId; }
    public void setPollStatusId(Long pollStatusId) { this.pollStatusId = pollStatusId; }
}