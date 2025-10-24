package New.Poll.App.Evercare.Polling.System.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "polls")
public class Poll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(unique = true, nullable = false)
    private String pollCode; // e.g., poll13859

    @Column(nullable = false)
    private String shareLink;

    @Column(nullable = false)
    private String qrCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "poll_status_id", nullable = false)
    private PollStatus pollStatus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chart_type_id", nullable = false)
    private ChartType chartType;

    @Column(nullable = false)
    private Boolean allowViewResults;

    @Column(nullable = false)
    private Long adminId;

    @ElementCollection
    @CollectionTable(name = "poll_required_demographics", joinColumns = @JoinColumn(name = "poll_id"))
    @Column(name = "demographic")
    private List<String> requiredDemographics = new ArrayList<>();

    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Question> questions = new ArrayList<>();

    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Response> responses = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Poll() {
    }

    public Poll(String title, String pollCode, String shareLink, String qrCode,
                PollStatus pollStatus, ChartType chartType, Boolean allowViewResults, Long adminId) {
        this.title = title;
        this.pollCode = pollCode;
        this.shareLink = shareLink;
        this.qrCode = qrCode;
        this.pollStatus = pollStatus;
        this.chartType = chartType;
        this.allowViewResults = allowViewResults;
        this.adminId = adminId;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPollCode() {
        return pollCode;
    }

    public void setPollCode(String pollCode) {
        this.pollCode = pollCode;
    }

    public String getShareLink() {
        return shareLink;
    }

    public void setShareLink(String shareLink) {
        this.shareLink = shareLink;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    public PollStatus getPollStatus() {
        return pollStatus;
    }

    public void setPollStatus(PollStatus pollStatus) {
        this.pollStatus = pollStatus;
    }

    public ChartType getChartType() {
        return chartType;
    }

    public void setChartType(ChartType chartType) {
        this.chartType = chartType;
    }

    public Boolean getAllowViewResults() {
        return allowViewResults;
    }

    public void setAllowViewResults(Boolean allowViewResults) {
        this.allowViewResults = allowViewResults;
    }

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }

    public List<String> getRequiredDemographics() {
        return requiredDemographics;
    }

    public void setRequiredDemographics(List<String> requiredDemographics) {
        this.requiredDemographics = requiredDemographics;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public List<Response> getResponses() {
        return responses;
    }

    public void setResponses(List<Response> responses) {
        this.responses = responses;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Poll poll = (Poll) o;
        return Objects.equals(id, poll.id) && Objects.equals(pollCode, poll.pollCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, pollCode);
    }

    @Override
    public String toString() {
        return "Poll{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", pollCode='" + pollCode + '\'' +
                ", pollStatus=" + pollStatus +
                ", chartType=" + chartType +
                ", adminId=" + adminId +
                ", createdAt=" + createdAt +
                '}';
    }

    public static PollBuilder builder() {
        return new PollBuilder();
    }

    public static class PollBuilder {
        private Long id;
        private String title;
        private String pollCode;
        private String shareLink;
        private String qrCode;
        private PollStatus pollStatus;
        private ChartType chartType;
        private Boolean allowViewResults;
        private Long adminId;
        private List<String> requiredDemographics = new ArrayList<>();
        private List<Question> questions = new ArrayList<>();
        private List<Response> responses = new ArrayList<>();
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public PollBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PollBuilder title(String title) {
            this.title = title;
            return this;
        }

        public PollBuilder pollCode(String pollCode) {
            this.pollCode = pollCode;
            return this;
        }

        public PollBuilder shareLink(String shareLink) {
            this.shareLink = shareLink;
            return this;
        }

        public PollBuilder qrCode(String qrCode) {
            this.qrCode = qrCode;
            return this;
        }

        public PollBuilder pollStatus(PollStatus pollStatus) {
            this.pollStatus = pollStatus;
            return this;
        }

        public PollBuilder chartType(ChartType chartType) {
            this.chartType = chartType;
            return this;
        }

        public PollBuilder allowViewResults(Boolean allowViewResults) {
            this.allowViewResults = allowViewResults;
            return this;
        }

        public PollBuilder adminId(Long adminId) {
            this.adminId = adminId;
            return this;
        }

        public PollBuilder requiredDemographics(List<String> requiredDemographics) {
            this.requiredDemographics = requiredDemographics;
            return this;
        }

        public PollBuilder questions(List<Question> questions) {
            this.questions = questions;
            return this;
        }

        public PollBuilder responses(List<Response> responses) {
            this.responses = responses;
            return this;
        }

        public PollBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public PollBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Poll build() {
            Poll poll = new Poll(title, pollCode, shareLink, qrCode, pollStatus, chartType,
                    allowViewResults, adminId);
            poll.id = this.id;
            poll.requiredDemographics = this.requiredDemographics;
            poll.questions = this.questions;
            poll.responses = this.responses;
            poll.createdAt = this.createdAt;
            poll.updatedAt = this.updatedAt;
            return poll;
        }
    }
}