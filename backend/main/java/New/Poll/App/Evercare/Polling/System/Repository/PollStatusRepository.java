package New.Poll.App.Evercare.Polling.System.Repository;

import New.Poll.App.Evercare.Polling.System.Model.PollStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PollStatusRepository extends JpaRepository<PollStatus, Long> {
    Optional<PollStatus> findByName(String name);
    List<PollStatus> findAll();
}