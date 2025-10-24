package New.Poll.App.Evercare.Polling.System.Controller;
import New.Poll.App.Evercare.Polling.System.Service.ResponseService;
import New.Poll.App.Evercare.Polling.System.DTO.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/responses")
public class ResponseController {

    @Autowired
    private ResponseService responseService;

    @PostMapping("/submit")
    public ResponseEntity<String> submitResponse(@RequestBody SubmitResponseRequest request) {
        responseService.submitResponse(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Response submitted successfully");
    }

    @GetMapping("/{pollCode}/results")
    public ResponseEntity<PollResultsDto> getResults(@PathVariable String pollCode) {
        PollResultsDto results = responseService.getResults(pollCode);
        return ResponseEntity.ok(results);
    }
}