package New.Poll.App.Evercare.Polling.System.DTO;

import java.util.List;

public class QuestionDto {
    private Long id;
    private String text;
    private Integer questionOrder;
    private List<AnswerDto> answers;

    public QuestionDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public Integer getQuestionOrder() { return questionOrder; }
    public void setQuestionOrder(Integer questionOrder) { this.questionOrder = questionOrder; }

    public List<AnswerDto> getAnswers() { return answers; }
    public void setAnswers(List<AnswerDto> answers) { this.answers = answers; }
}
