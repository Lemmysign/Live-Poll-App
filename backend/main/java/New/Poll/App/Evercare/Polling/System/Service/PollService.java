package New.Poll.App.Evercare.Polling.System.Service;

import New.Poll.App.Evercare.Polling.System.DTO.AdminDashboardDto;
import New.Poll.App.Evercare.Polling.System.DTO.CreatePollRequest;
import New.Poll.App.Evercare.Polling.System.DTO.PollResponse;
import New.Poll.App.Evercare.Polling.System.DTO.PollResultsDto;

import java.util.List;

public interface PollService {
    PollResponse createPoll(Long adminId, CreatePollRequest request);
    PollResponse getPollByCode(String pollCode);
    List<PollResponse> getPollsByAdmin(Long adminId);
    AdminDashboardDto getAdminDashboard(Long adminId);
    PollResponse updatePollStatus(Long pollId, Long pollStatusId);
    void deletePoll(Long pollId);
    PollResultsDto getPollResults(String pollCode);
}