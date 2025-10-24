package New.Poll.App.Evercare.Polling.System.Repository;

import New.Poll.App.Evercare.Polling.System.Model.ChartType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChartTypeRepository extends JpaRepository<ChartType, Long> {
    Optional<ChartType> findByName(String name);
    List<ChartType> findAll();
}