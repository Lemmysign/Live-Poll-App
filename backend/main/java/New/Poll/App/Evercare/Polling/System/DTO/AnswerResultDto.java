package New.Poll.App.Evercare.Polling.System.DTO;

public class AnswerResultDto {
    private Long answerId;
    private String answerText;
    private Long responseCount;
    private Double percentage;

    public AnswerResultDto() {}

    public AnswerResultDto(Long answerId, String answerText, Long responseCount, Double percentage) {
        this.answerId = answerId;
        this.answerText = answerText;
        this.responseCount = responseCount;
        this.percentage = percentage;
    }

    public Long getAnswerId() { return answerId; }
    public void setAnswerId(Long answerId) { this.answerId = answerId; }

    public String getAnswerText() { return answerText; }
    public void setAnswerText(String answerText) { this.answerText = answerText; }

    public Long getResponseCount() { return responseCount; }
    public void setResponseCount(Long responseCount) { this.responseCount = responseCount; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
}
