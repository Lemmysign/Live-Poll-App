package New.Poll.App.Evercare.Polling.System.Service;
import New.Poll.App.Evercare.Polling.System.DTO.PollStatusDto;
import java.util.List;

public interface PollStatusService {
    List<PollStatusDto> getAllStatuses();
    PollStatusDto getStatusById(Long id);
}