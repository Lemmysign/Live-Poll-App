package New.Poll.App.Evercare.Polling.System.Service;

import New.Poll.App.Evercare.Polling.System.DTO.SubmitResponseRequest;
import New.Poll.App.Evercare.Polling.System.Model.Poll;

public interface ValidationService {
    void validateDemographics(SubmitResponseRequest request, Poll poll);
}