package New.Poll.App.Evercare.Polling.System.DTO;

import java.util.List;

public class QuestionResultDto {
    private Long questionId;
    private String questionText;
    private List<AnswerResultDto> answerResults;

    public QuestionResultDto() {}

    public QuestionResultDto(Long questionId, String questionText, List<AnswerResultDto> answerResults) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.answerResults = answerResults;
    }

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public List<AnswerResultDto> getAnswerResults() { return answerResults; }
    public void setAnswerResults(List<AnswerResultDto> answerResults) { this.answerResults = answerResults; }
}