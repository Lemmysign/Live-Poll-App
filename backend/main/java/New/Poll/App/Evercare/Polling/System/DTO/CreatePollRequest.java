package New.Poll.App.Evercare.Polling.System.DTO;

import java.util.List;

public class CreatePollRequest {
    private String title;
    private Long pollStatusId;
    private Long chartTypeId;
    private Boolean allowViewResults;
    private List<String> requiredDemographics;
    private List<QuestionRequest> questions;

    public CreatePollRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Long getPollStatusId() { return pollStatusId; }
    public void setPollStatusId(Long pollStatusId) { this.pollStatusId = pollStatusId; }

    public Long getChartTypeId() { return chartTypeId; }
    public void setChartTypeId(Long chartTypeId) { this.chartTypeId = chartTypeId; }

    public Boolean getAllowViewResults() { return allowViewResults; }
    public void setAllowViewResults(Boolean allowViewResults) { this.allowViewResults = allowViewResults; }

    public List<String> getRequiredDemographics() { return requiredDemographics; }
    public void setRequiredDemographics(List<String> requiredDemographics) { this.requiredDemographics = requiredDemographics; }

    public List<QuestionRequest> getQuestions() { return questions; }
    public void setQuestions(List<QuestionRequest> questions) { this.questions = questions; }
}