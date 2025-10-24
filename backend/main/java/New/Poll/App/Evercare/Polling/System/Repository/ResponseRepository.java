package New.Poll.App.Evercare.Polling.System.Repository;

import New.Poll.App.Evercare.Polling.System.Model.Response;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Long> {


    @Query("SELECT COUNT(r) FROM Response r WHERE r.poll.id = ?1")
    Long countByPollId(Long pollId);

    @Query("SELECT COUNT(r) FROM Response r WHERE r.answer.id = ?1")
    Long countByAnswerId(Long answerId);

    void deleteByPollId(Long pollId);

    List<Response> findByPollIdOrderByCreatedAtDesc(Long pollId);
}
