package New.Poll.App.Evercare.Polling.System.Service;

import New.Poll.App.Evercare.Polling.System.DTO.PollResultsDto;

public interface WebSocketService {
    void sendPollResults(String pollCode, PollResultsDto results);
}
