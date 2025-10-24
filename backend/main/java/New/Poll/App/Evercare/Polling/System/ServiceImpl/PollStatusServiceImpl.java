package New.Poll.App.Evercare.Polling.System.ServiceImpl;

import New.Poll.App.Evercare.Polling.System.Repository.PollStatusRepository;
import New.Poll.App.Evercare.Polling.System.Service.PollStatusService;
import New.Poll.App.Evercare.Polling.System.DTO.PollStatusDto;
import New.Poll.App.Evercare.Polling.System.Exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PollStatusServiceImpl implements PollStatusService {

    @Autowired
    private PollStatusRepository pollStatusRepository;

    @Override
    public List<PollStatusDto> getAllStatuses() {
        return pollStatusRepository.findAll().stream()
                .map(status -> new PollStatusDto(status.getId(), status.getName(), status.getDescription()))
                .collect(Collectors.toList());
    }

    @Override
    public PollStatusDto getStatusById(Long id) {
        return pollStatusRepository.findById(id)
                .map(status -> new PollStatusDto(status.getId(), status.getName(), status.getDescription()))
                .orElseThrow(() -> new ResourceNotFoundException("Poll Status not found with id: " + id));
    }
}