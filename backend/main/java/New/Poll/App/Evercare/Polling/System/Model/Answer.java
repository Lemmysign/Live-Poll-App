package New.Poll.App.Evercare.Polling.System.Model;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "answers")
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private Integer answerOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(nullable = false)
    private Long responseCount;

    @Version  // ADD THIS - Provides optimistic locking for concurrent updates
    private Long version;

    public Answer() {}

    public Answer(String text, Integer answerOrder) {
        this.text = text;
        this.answerOrder = answerOrder;
        this.responseCount = 0L;
    }

    public Answer(String text, Integer answerOrder, Question question) {
        this.text = text;
        this.answerOrder = answerOrder;
        this.question = question;
        this.responseCount = 0L;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Integer getAnswerOrder() {
        return answerOrder;
    }

    public void setAnswerOrder(Integer answerOrder) {
        this.answerOrder = answerOrder;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Long getResponseCount() {
        return responseCount;
    }

    public void setResponseCount(Long responseCount) {
        this.responseCount = responseCount;
    }

    public Long getVersion() {  // ADD getter for version
        return version;
    }

    public void setVersion(Long version) {  // ADD setter for version
        this.version = version;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Answer answer = (Answer) o;
        return Objects.equals(id, answer.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public static AnswerBuilder builder() {
        return new AnswerBuilder();
    }

    public static class AnswerBuilder {
        private Long id;
        private String text;
        private Integer answerOrder;
        private Question question;
        private Long responseCount;
        private Long version;  // ADD this

        public AnswerBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public AnswerBuilder text(String text) {
            this.text = text;
            return this;
        }

        public AnswerBuilder answerOrder(Integer answerOrder) {
            this.answerOrder = answerOrder;
            return this;
        }

        public AnswerBuilder question(Question question) {
            this.question = question;
            return this;
        }

        public AnswerBuilder responseCount(Long responseCount) {
            this.responseCount = responseCount;
            return this;
        }

        public AnswerBuilder version(Long version) {  // ADD this
            this.version = version;
            return this;
        }

        public Answer build() {
            Answer answer = new Answer(text, answerOrder, question);
            answer.id = this.id;
            answer.responseCount = this.responseCount != null ? this.responseCount : 0L;
            answer.version = this.version;
            return answer;
        }
    }
}