package New.Poll.App.Evercare.Polling.System.ServiceImpl;

import New.Poll.App.Evercare.Polling.System.Service.ValidationService;
import New.Poll.App.Evercare.Polling.System.DTO.SubmitResponseRequest;
import New.Poll.App.Evercare.Polling.System.Model.Poll;
import New.Poll.App.Evercare.Polling.System.Exception.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ValidationServiceImpl implements ValidationService {

    @Override
    public void validateDemographics(SubmitResponseRequest request, Poll poll) {
        List<String> requiredDemographics = poll.getRequiredDemographics();

        if (requiredDemographics == null || requiredDemographics.isEmpty()) {
            return;
        }

        List<String> missingFields = new ArrayList<>();

        if (requiredDemographics.contains("name")) {
            if (request.getRespondentName() == null || request.getRespondentName().trim().isEmpty()) {
                missingFields.add("name");
            }
        }

        if (requiredDemographics.contains("gender")) {
            if (request.getRespondentGender() == null || request.getRespondentGender().trim().isEmpty()) {
                missingFields.add("gender");
            }
        }

        if (requiredDemographics.contains("age")) {
            if (request.getRespondentAge() == null) {
                missingFields.add("age");
            }
        }

        if (!missingFields.isEmpty()) {
            throw new BadRequestException("Missing required demographics: " + String.join(", ", missingFields));
        }
    }
}