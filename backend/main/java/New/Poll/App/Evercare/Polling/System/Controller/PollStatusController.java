package New.Poll.App.Evercare.Polling.System.Controller;

import New.Poll.App.Evercare.Polling.System.Service.PollStatusService;
import New.Poll.App.Evercare.Polling.System.DTO.PollStatusDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/poll-statuses")
public class PollStatusController {

    @Autowired
    private PollStatusService pollStatusService;

    @GetMapping
    public ResponseEntity<List<PollStatusDto>> getAllStatuses() {
        List<PollStatusDto> statuses = pollStatusService.getAllStatuses();
        return ResponseEntity.ok(statuses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PollStatusDto> getStatusById(@PathVariable Long id) {
        PollStatusDto status = pollStatusService.getStatusById(id);
        return ResponseEntity.ok(status);
    }
}