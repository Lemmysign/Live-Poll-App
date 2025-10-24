package New.Poll.App.Evercare.Polling.System.DTO;

public class AnswerDto {
    private Long id;
    private String text;
    private Integer answerOrder;
    private Long responseCount;

    public AnswerDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public Integer getAnswerOrder() { return answerOrder; }
    public void setAnswerOrder(Integer answerOrder) { this.answerOrder = answerOrder; }

    public Long getResponseCount() { return responseCount; }
    public void setResponseCount(Long responseCount) { this.responseCount = responseCount; }
}