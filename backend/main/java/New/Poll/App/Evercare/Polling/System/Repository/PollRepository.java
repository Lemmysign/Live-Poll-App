package New.Poll.App.Evercare.Polling.System.Repository;

import New.Poll.App.Evercare.Polling.System.Model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {
    Optional<Poll> findByPollCode(String pollCode);
    List<Poll> findByAdminId(Long adminId);
    List<Poll> findByAdminIdOrderByCreatedAtDesc(Long adminId);

    @Query("SELECT COUNT(p) FROM Poll p WHERE p.adminId = ?1")
    Long countByAdminId(Long adminId);

    @Query("SELECT COUNT(p) FROM Poll p WHERE p.adminId = ?1 AND p.pollStatus.id = ?2")
    Long countByAdminIdAndPollStatusId(Long adminId, Long pollStatusId);
}