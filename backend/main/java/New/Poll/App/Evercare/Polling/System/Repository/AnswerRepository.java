package New.Poll.App.Evercare.Polling.System.Repository;

import New.Poll.App.Evercare.Polling.System.Model.Answer;
import New.Poll.App.Evercare.Polling.System.Model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

    List<Answer> findByQuestionIdOrderByAnswerOrder(Long questionId);

    /**
     * Atomically increments the response count for an answer.
     * This prevents race conditions during concurrent submissions.
     */
    @Modifying
    @Query("UPDATE Answer a SET a.responseCount = a.responseCount + 1 WHERE a.id = :answerId")
    void incrementResponseCount(@Param("answerId") Long answerId);
}