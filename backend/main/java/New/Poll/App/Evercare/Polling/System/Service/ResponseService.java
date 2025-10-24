package New.Poll.App.Evercare.Polling.System.Service;

import New.Poll.App.Evercare.Polling.System.DTO.SubmitResponseRequest;
import New.Poll.App.Evercare.Polling.System.DTO.PollResultsDto;

public interface ResponseService {
    void submitResponse(SubmitResponseRequest request);
    PollResultsDto getResults(String pollCode);
}