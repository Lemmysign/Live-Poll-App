package New.Poll.App.Evercare.Polling.System.ServiceImpl;

import New.Poll.App.Evercare.Polling.System.Service.PollService;
import New.Poll.App.Evercare.Polling.System.Model.*;
import New.Poll.App.Evercare.Polling.System.Repository.*;
import New.Poll.App.Evercare.Polling.System.DTO.*;
import New.Poll.App.Evercare.Polling.System.Exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PollServiceImpl implements PollService {

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private PollStatusRepository pollStatusRepository;

    @Autowired
    private ChartTypeRepository chartTypeRepository;

    @Autowired
    private ResponseRepository responseRepository;

    @Override
    public PollResponse createPoll(Long adminId, CreatePollRequest request) {
        PollStatus pollStatus = pollStatusRepository.findById(request.getPollStatusId())
                .orElseThrow(() -> new ResourceNotFoundException("Poll Status not found"));

        ChartType chartType = chartTypeRepository.findById(request.getChartTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Chart Type not found"));

        String pollCode = generatePollCode();
        String shareLink = "http://localhost:3000/poll/" + pollCode;
        String qrCode = "qr_" + pollCode + ".png";

        Poll poll = new Poll(request.getTitle(), pollCode, shareLink, qrCode,
                pollStatus, chartType, request.getAllowViewResults(), adminId);
        poll.setRequiredDemographics(request.getRequiredDemographics());

        Poll savedPoll = pollRepository.save(poll);

        // Create Questions and Answers
        if (request.getQuestions() != null && !request.getQuestions().isEmpty()) {
            for (QuestionRequest qReq : request.getQuestions()) {
                Question question = new Question(qReq.getText(), qReq.getQuestionOrder(), savedPoll);
                Question savedQuestion = questionRepository.save(question);

                int answerOrder = 1;
                if (qReq.getAnswers() != null && !qReq.getAnswers().isEmpty()) {
                    for (String answerText : qReq.getAnswers()) {
                        Answer answer = new Answer(answerText, answerOrder, savedQuestion);
                        answerRepository.save(answer);
                        answerOrder++;
                    }
                }
            }
        }

        // Fetch all questions for this poll
        List<Question> questions = questionRepository.findByPollIdOrderByQuestionOrder(savedPoll.getId());

        // Fetch answers for each question
        for (Question question : questions) {
            List<Answer> answers = answerRepository.findByQuestionIdOrderByAnswerOrder(question.getId());
            question.setAnswers(answers);
        }

        savedPoll.setQuestions(questions);

        return mapPollToResponse(savedPoll);
    }

    @Override
    public PollResponse getPollByCode(String pollCode) {
        Poll poll = pollRepository.findByPollCode(pollCode)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found with code: " + pollCode));
        return mapPollToResponse(poll);
    }

    @Override
    public List<PollResponse> getPollsByAdmin(Long adminId) {
        List<Poll> polls = pollRepository.findByAdminIdOrderByCreatedAtDesc(adminId);
        return polls.stream().map(this::mapPollToResponse).collect(Collectors.toList());
    }

    @Override
    public AdminDashboardDto getAdminDashboard(Long adminId) {
        Long totalPolls = pollRepository.countByAdminId(adminId);
        Long activePolls = pollStatusRepository.findByName("ACTIVE")
                .map(status -> pollRepository.countByAdminIdAndPollStatusId(adminId, status.getId()))
                .orElse(0L);

        List<Poll> allPolls = pollRepository.findByAdminIdOrderByCreatedAtDesc(adminId);
        Long totalQuestions = allPolls.stream()
                .mapToLong(poll -> questionRepository.countByPollId(poll.getId()))
                .sum();

        List<PollResponse> recentPolls = allPolls.stream()
                .limit(5)
                .map(this::mapPollToResponse)
                .collect(Collectors.toList());

        return new AdminDashboardDto(totalPolls, totalQuestions, activePolls, recentPolls);
    }

    @Override
    public PollResponse updatePollStatus(Long pollId, Long pollStatusId) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found"));

        PollStatus pollStatus = pollStatusRepository.findById(pollStatusId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll Status not found"));

        poll.setPollStatus(pollStatus);
        Poll updatedPoll = pollRepository.save(poll);

        return mapPollToResponse(updatedPoll);
    }

    @Transactional
    public void deletePoll(Long pollId) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        // Delete all responses associated with this poll first
        responseRepository.deleteByPollId(pollId);

        // Then delete the poll
        pollRepository.delete(poll);
    }
    @Override
    public PollResultsDto getPollResults(String pollCode) {
        Poll poll = pollRepository.findByPollCode(pollCode)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found"));

        Long totalResponses = responseRepository.countByPollId(poll.getId());

        List<QuestionResultDto> questionResults = poll.getQuestions().stream()
                .map(question -> {
                    List<AnswerResultDto> answerResults = question.getAnswers() != null
                            ? question.getAnswers().stream()
                            .map(answer -> {
                                Long responseCount = responseRepository.countByAnswerId(answer.getId());
                                Double percentage = totalResponses > 0 ? (responseCount.doubleValue() / totalResponses) * 100 : 0.0;
                                return new AnswerResultDto(answer.getId(), answer.getText(), responseCount, percentage);
                            })
                            .collect(Collectors.toList())
                            : new ArrayList<>();

                    return new QuestionResultDto(question.getId(), question.getText(), answerResults);
                })
                .collect(Collectors.toList());

        return new PollResultsDto(poll.getId(), poll.getTitle(), poll.getChartType().getName(),
                totalResponses, questionResults);
    }

    private String generatePollCode() {
        return "poll" + System.currentTimeMillis();
    }

    private PollResponse mapPollToResponse(Poll poll) {
        PollResponse response = new PollResponse();
        response.setId(poll.getId());
        response.setTitle(poll.getTitle());
        response.setPollCode(poll.getPollCode());
        response.setShareLink(poll.getShareLink());
        response.setQrCode(poll.getQrCode());
        response.setAllowViewResults(poll.getAllowViewResults());
        response.setRequiredDemographics(poll.getRequiredDemographics());

        PollStatusDto statusDto = new PollStatusDto(poll.getPollStatus().getId(),
                poll.getPollStatus().getName(),
                poll.getPollStatus().getDescription());
        response.setPollStatus(statusDto);

        ChartTypeDto chartTypeDto = new ChartTypeDto(poll.getChartType().getId(),
                poll.getChartType().getName(),
                poll.getChartType().getDescription());
        response.setChartType(chartTypeDto);

        List<QuestionDto> questionDtos = poll.getQuestions() != null
                ? poll.getQuestions().stream()
                .map(question -> {
                    QuestionDto qDto = new QuestionDto();
                    qDto.setId(question.getId());
                    qDto.setText(question.getText());
                    qDto.setQuestionOrder(question.getQuestionOrder());

                    List<AnswerDto> answerDtos = question.getAnswers() != null
                            ? question.getAnswers().stream()
                            .map(answer -> {
                                AnswerDto aDto = new AnswerDto();
                                aDto.setId(answer.getId());
                                aDto.setText(answer.getText());
                                aDto.setAnswerOrder(answer.getAnswerOrder());
                                aDto.setResponseCount(answer.getResponseCount());
                                return aDto;
                            })
                            .collect(Collectors.toList())
                            : new ArrayList<>();

                    qDto.setAnswers(answerDtos);
                    return qDto;
                })
                .collect(Collectors.toList())
                : new ArrayList<>();

        response.setQuestions(questionDtos);
        response.setTotalResponses(responseRepository.countByPollId(poll.getId()));

        return response;
    }
}