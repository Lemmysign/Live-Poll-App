package New.Poll.App.Evercare.Polling.System.Controller;

import New.Poll.App.Evercare.Polling.System.Service.PollService;
import New.Poll.App.Evercare.Polling.System.DTO.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/polls")
public class PollController {

    @Autowired
    private PollService pollService;

    @PostMapping("/create")
    public ResponseEntity<PollResponse> createPoll(@RequestParam Long adminId,
                                                   @RequestBody CreatePollRequest request) {
        PollResponse response = pollService.createPoll(adminId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/code/{pollCode}")
    public ResponseEntity<PollResponse> getPollByCode(@PathVariable String pollCode) {
        PollResponse response = pollService.getPollByCode(pollCode);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/{adminId}")
    public ResponseEntity<java.util.List<PollResponse>> getPollsByAdmin(@PathVariable Long adminId) {
        java.util.List<PollResponse> polls = pollService.getPollsByAdmin(adminId);
        return ResponseEntity.ok(polls);
    }

    @GetMapping("/dashboard/{adminId}")
    public ResponseEntity<AdminDashboardDto> getAdminDashboard(@PathVariable Long adminId) {
        AdminDashboardDto dashboard = pollService.getAdminDashboard(adminId);
        return ResponseEntity.ok(dashboard);
    }

    @PutMapping("/{pollId}/status/{statusId}")
    public ResponseEntity<PollResponse> updatePollStatus(@PathVariable Long pollId,
                                                         @PathVariable Long statusId) {
        PollResponse response = pollService.updatePollStatus(pollId, statusId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{pollId}")
    public ResponseEntity<Void> deletePoll(@PathVariable Long pollId) {
        pollService.deletePoll(pollId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{pollCode}/results")
    public ResponseEntity<PollResultsDto> getPollResults(@PathVariable String pollCode) {
        PollResultsDto results = pollService.getPollResults(pollCode);
        return ResponseEntity.ok(results);
    }
}
