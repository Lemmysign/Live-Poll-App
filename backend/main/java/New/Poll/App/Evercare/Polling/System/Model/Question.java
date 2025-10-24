package New.Poll.App.Evercare.Polling.System.Model;
import jakarta.persistence.*;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;


@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private Integer questionOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poll_id", nullable = false)
    private Poll poll;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Answer> answers;

    public Question() {}

    public Question(String text, Integer questionOrder, Poll poll) {
        this.text = text;
        this.questionOrder = questionOrder;
        this.poll = poll;
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

    public Integer getQuestionOrder() {
        return questionOrder;
    }

    public void setQuestionOrder(Integer questionOrder) {
        this.questionOrder = questionOrder;
    }

    public Poll getPoll() {
        return poll;
    }

    public void setPoll(Poll poll) {
        this.poll = poll;
    }

    public List<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Question question = (Question) o;
        return Objects.equals(id, question.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public static QuestionBuilder builder() {
        return new QuestionBuilder();
    }

    public static class QuestionBuilder {
        private Long id;
        private String text;
        private Integer questionOrder;
        private Poll poll;
        private List<Answer> answers;

        public QuestionBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public QuestionBuilder text(String text) {
            this.text = text;
            return this;
        }

        public QuestionBuilder questionOrder(Integer questionOrder) {
            this.questionOrder = questionOrder;
            return this;
        }

        public QuestionBuilder poll(Poll poll) {
            this.poll = poll;
            return this;
        }

        public QuestionBuilder answers(List<Answer> answers) {
            this.answers = answers;
            return this;
        }

        public Question build() {
            Question question = new Question(text, questionOrder, poll);
            question.id = this.id;
            question.answers = this.answers;
            return question;
        }
    }
}