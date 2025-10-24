package New.Poll.App.Evercare.Polling.System.DTO;

import java.util.List;

public class PollResultsDto {
    private Long pollId;
    private String title;
    private String chartType;
    private Long totalResponses;
    private List<QuestionResultDto> questionResults;

    public PollResultsDto() {}

    public PollResultsDto(Long pollId, String title, String chartType, Long totalResponses, List<QuestionResultDto> questionResults) {
        this.pollId = pollId;
        this.title = title;
        this.chartType = chartType;
        this.totalResponses = totalResponses;
        this.questionResults = questionResults;
    }

    public Long getPollId() { return pollId; }
    public void setPollId(Long pollId) { this.pollId = pollId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getChartType() { return chartType; }
    public void setChartType(String chartType) { this.chartType = chartType; }

    public Long getTotalResponses() { return totalResponses; }
    public void setTotalResponses(Long totalResponses) { this.totalResponses = totalResponses; }

    public List<QuestionResultDto> getQuestionResults() { return questionResults; }
    public void setQuestionResults(List<QuestionResultDto> questionResults) { this.questionResults = questionResults; }
}
