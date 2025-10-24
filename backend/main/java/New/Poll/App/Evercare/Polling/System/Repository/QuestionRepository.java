package New.Poll.App.Evercare.Polling.System.Repository;

import New.Poll.App.Evercare.Polling.System.Model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByPollIdOrderByQuestionOrder(Long pollId);

    @Query("SELECT COUNT(q) FROM Question q WHERE q.poll.id = ?1")
    Long countByPollId(Long pollId);
}