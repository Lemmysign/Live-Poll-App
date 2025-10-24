package New.Poll.App.Evercare.Polling.System.DTO;

import java.util.List;

public class SubmitResponseRequest {
    private String pollCode;
    private List<ResponseAnswer> answers;
    private String respondentName;
    private String respondentGender;
    private Integer respondentAge;

    public SubmitResponseRequest() {}

    public String getPollCode() { return pollCode; }
    public void setPollCode(String pollCode) { this.pollCode = pollCode; }

    public List<ResponseAnswer> getAnswers() { return answers; }
    public void setAnswers(List<ResponseAnswer> answers) { this.answers = answers; }

    public String getRespondentName() { return respondentName; }
    public void setRespondentName(String respondentName) { this.respondentName = respondentName; }

    public String getRespondentGender() { return respondentGender; }
    public void setRespondentGender(String respondentGender) { this.respondentGender = respondentGender; }

    public Integer getRespondentAge() { return respondentAge; }
    public void setRespondentAge(Integer respondentAge) { this.respondentAge = respondentAge; }
}