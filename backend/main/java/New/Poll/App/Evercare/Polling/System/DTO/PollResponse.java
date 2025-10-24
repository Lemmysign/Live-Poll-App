package New.Poll.App.Evercare.Polling.System.DTO;

import java.util.List;

public class PollResponse {
    private Long id;
    private String title;
    private String pollCode;
    private String shareLink;
    private String qrCode;
    private PollStatusDto pollStatus;
    private ChartTypeDto chartType;
    private Boolean allowViewResults;
    private List<String> requiredDemographics;
    private List<QuestionDto> questions;
    private Long totalResponses;

    public PollResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPollCode() { return pollCode; }
    public void setPollCode(String pollCode) { this.pollCode = pollCode; }

    public String getShareLink() { return shareLink; }
    public void setShareLink(String shareLink) { this.shareLink = shareLink; }

    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }

    public PollStatusDto getPollStatus() { return pollStatus; }
    public void setPollStatus(PollStatusDto pollStatus) { this.pollStatus = pollStatus; }

    public ChartTypeDto getChartType() { return chartType; }
    public void setChartType(ChartTypeDto chartType) { this.chartType = chartType; }

    public Boolean getAllowViewResults() { return allowViewResults; }
    public void setAllowViewResults(Boolean allowViewResults) { this.allowViewResults = allowViewResults; }

    public List<String> getRequiredDemographics() { return requiredDemographics; }
    public void setRequiredDemographics(List<String> requiredDemographics) { this.requiredDemographics = requiredDemographics; }

    public List<QuestionDto> getQuestions() { return questions; }
    public void setQuestions(List<QuestionDto> questions) { this.questions = questions; }

    public Long getTotalResponses() { return totalResponses; }
    public void setTotalResponses(Long totalResponses) { this.totalResponses = totalResponses; }
}
