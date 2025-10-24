package New.Poll.App.Evercare.Polling.System.DTO;

import java.util.List;

public class AdminDashboardDto {
    private Long totalPolls;
    private Long totalQuestions;
    private Long activePolls;
    private List<PollResponse> recentPolls;

    public AdminDashboardDto() {}

    public AdminDashboardDto(Long totalPolls, Long totalQuestions, Long activePolls, List<PollResponse> recentPolls) {
        this.totalPolls = totalPolls;
        this.totalQuestions = totalQuestions;
        this.activePolls = activePolls;
        this.recentPolls = recentPolls;
    }

    public Long getTotalPolls() { return totalPolls; }
    public void setTotalPolls(Long totalPolls) { this.totalPolls = totalPolls; }

    public Long getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Long totalQuestions) { this.totalQuestions = totalQuestions; }

    public Long getActivePolls() { return activePolls; }
    public void setActivePolls(Long activePolls) { this.activePolls = activePolls; }

    public List<PollResponse> getRecentPolls() { return recentPolls; }
    public void setRecentPolls(List<PollResponse> recentPolls) { this.recentPolls = recentPolls; }
}