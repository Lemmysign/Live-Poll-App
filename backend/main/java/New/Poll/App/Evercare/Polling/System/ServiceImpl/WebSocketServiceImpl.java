package New.Poll.App.Evercare.Polling.System.ServiceImpl;

import New.Poll.App.Evercare.Polling.System.Service.WebSocketService;
import New.Poll.App.Evercare.Polling.System.DTO.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class WebSocketServiceImpl implements WebSocketService {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketServiceImpl.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    @Async("webSocketTaskExecutor")  // Makes this non-blocking
    public void sendPollResults(String pollCode, PollResultsDto results) {
        try {
            WebSocketMessage message = new WebSocketMessage("POLL_UPDATED", pollCode, results);
            messagingTemplate.convertAndSend("/topic/poll/" + pollCode, message);
            logger.debug("Sent poll results update for poll: {}", pollCode);
        } catch (Exception e) {
            logger.error("Failed to send WebSocket message for poll: {}", pollCode, e);
            // Don't throw - we don't want WebSocket failures to break the submission
        }
    }
}