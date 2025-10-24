package New.Poll.App.Evercare.Polling.System.ServiceImpl;

import New.Poll.App.Evercare.Polling.System.Model.*;
import New.Poll.App.Evercare.Polling.System.Repository.*;
import New.Poll.App.Evercare.Polling.System.Service.ResponseService;
import New.Poll.App.Evercare.Polling.System.Service.PollService;
import New.Poll.App.Evercare.Polling.System.DTO.*;
import New.Poll.App.Evercare.Polling.System.Exception.ResourceNotFoundException;
import New.Poll.App.Evercare.Polling.System.Service.ValidationService;
import New.Poll.App.Evercare.Polling.System.Service.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ResponseServiceImpl implements ResponseService {

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private PollService pollService;

    @Autowired
    private ValidationService validationService;

    @Autowired
    private WebSocketService webSocketService;

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void submitResponse(SubmitResponseRequest request) {
        Poll poll = pollRepository.findByPollCode(request.getPollCode())
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found"));

        validationService.validateDemographics(request, poll);

        // Batch fetch all questions and answers to avoid N+1 queries
        List<Long> questionIds = request.getAnswers().stream()
                .map(ResponseAnswer::getQuestionId)
                .collect(Collectors.toList());

        List<Long> answerIds = request.getAnswers().stream()
                .map(ResponseAnswer::getAnswerId)
                .collect(Collectors.toList());

        Map<Long, Question> questionsMap = questionRepository.findAllById(questionIds)
                .stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        Map<Long, Answer> answersMap = answerRepository.findAllById(answerIds)
                .stream()
                .collect(Collectors.toMap(Answer::getId, a -> a));

        // Batch create responses
        List<Response> responses = request.getAnswers().stream()
                .map(responseAnswer -> {
                    Question question = questionsMap.get(responseAnswer.getQuestionId());
                    Answer answer = answersMap.get(responseAnswer.getAnswerId());

                    if (question == null) {
                        throw new ResourceNotFoundException("Question not found: " + responseAnswer.getQuestionId());
                    }
                    if (answer == null) {
                        throw new ResourceNotFoundException("Answer not found: " + responseAnswer.getAnswerId());
                    }

                    return new Response(poll, question, answer, request.getRespondentName(),
                            request.getRespondentGender(), request.getRespondentAge());
                })
                .collect(Collectors.toList());

        responseRepository.saveAll(responses);

        // Use database-level atomic increment instead of read-modify-write
        for (Long answerId : answerIds) {
            answerRepository.incrementResponseCount(answerId);
        }

        // Send real-time update via WebSocket (async recommended)
        PollResultsDto results = pollService.getPollResults(request.getPollCode());
        webSocketService.sendPollResults(request.getPollCode(), results);
    }

    @Override
    public PollResultsDto getResults(String pollCode) {
        return pollService.getPollResults(pollCode);
    }
}