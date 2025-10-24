package New.Poll.App.Evercare.Polling.System.DTO;

import java.util.List;

public class QuestionRequest {
    private String text;
    private Integer questionOrder;
    private List<String> answers;

    public QuestionRequest() {}

    public QuestionRequest(String text, Integer questionOrder, List<String> answers) {
        this.text = text;
        this.questionOrder = questionOrder;
        this.answers = answers;
    }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public Integer getQuestionOrder() { return questionOrder; }
    public void setQuestionOrder(Integer questionOrder) { this.questionOrder = questionOrder; }

    public List<String> getAnswers() { return answers; }
    public void setAnswers(List<String> answers) { this.answers = answers; }
}
