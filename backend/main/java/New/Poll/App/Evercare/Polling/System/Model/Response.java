package New.Poll.App.Evercare.Polling.System.Model;
import jakarta.persistence.*;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "responses")
public class Response {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poll_id", nullable = false)
    private Poll poll;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_id", nullable = false)
    private Answer answer;

    private String respondentName;
    private String respondentGender;
    private Integer respondentAge;

    private LocalDateTime createdAt;

    public Response() {}

    public Response(Poll poll, Question question, Answer answer, String respondentName,
                    String respondentGender, Integer respondentAge) {
        this.poll = poll;
        this.question = question;
        this.answer = answer;
        this.respondentName = respondentName;
        this.respondentGender = respondentGender;
        this.respondentAge = respondentAge;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Poll getPoll() {
        return poll;
    }

    public void setPoll(Poll poll) {
        this.poll = poll;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Answer getAnswer() {
        return answer;
    }

    public void setAnswer(Answer answer) {
        this.answer = answer;
    }

    public String getRespondentName() {
        return respondentName;
    }

    public void setRespondentName(String respondentName) {
        this.respondentName = respondentName;
    }

    public String getRespondentGender() {
        return respondentGender;
    }

    public void setRespondentGender(String respondentGender) {
        this.respondentGender = respondentGender;
    }

    public Integer getRespondentAge() {
        return respondentAge;
    }

    public void setRespondentAge(Integer respondentAge) {
        this.respondentAge = respondentAge;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Response response = (Response) o;
        return Objects.equals(id, response.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public static ResponseBuilder builder() {
        return new ResponseBuilder();
    }

    public static class ResponseBuilder {
        private Long id;
        private Poll poll;
        private Question question;
        private Answer answer;
        private String respondentName;
        private String respondentGender;
        private Integer respondentAge;
        private LocalDateTime createdAt;

        public ResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ResponseBuilder poll(Poll poll) {
            this.poll = poll;
            return this;
        }

        public ResponseBuilder question(Question question) {
            this.question = question;
            return this;
        }

        public ResponseBuilder answer(Answer answer) {
            this.answer = answer;
            return this;
        }

        public ResponseBuilder respondentName(String respondentName) {
            this.respondentName = respondentName;
            return this;
        }

        public ResponseBuilder respondentGender(String respondentGender) {
            this.respondentGender = respondentGender;
            return this;
        }

        public ResponseBuilder respondentAge(Integer respondentAge) {
            this.respondentAge = respondentAge;
            return this;
        }

        public ResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Response build() {
            Response response = new Response(poll, question, answer, respondentName,
                    respondentGender, respondentAge);
            response.id = this.id;
            response.createdAt = this.createdAt;
            return response;
        }
    }
}