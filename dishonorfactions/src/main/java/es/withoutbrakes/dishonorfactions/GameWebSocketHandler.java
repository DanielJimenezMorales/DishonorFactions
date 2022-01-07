package es.withoutbrakes.dishonorfactions;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class GameWebSocketHandler extends TextWebSocketHandler
{
	private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
	private List<String> sessionsWithoutALobby = new ArrayList<String>();
	private List<Lobby> lobbies = new ArrayList<Lobby>();
	
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		System.out.println("Usuario conectado: " + session.getId());
		sessions.put(session.getId(), session);
		sessionsWithoutALobby.add(session.getId());
		
		if(sessionsWithoutALobby.size() >= 2)
		{
			createLobby(sessionsWithoutALobby.get(0), sessionsWithoutALobby.get(1));
		}
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println("Usuario desconectado: " + session.getId());
		sessions.remove(session.getId());
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception
	{
		System.out.println("Meessage received: " + message.getPayload());
		
		String responseMessge = "Respuesta al mensaje: " + message.getPayload();
		session.sendMessage(new TextMessage(responseMessge));
	}
	
	private void createLobby(String session1, String session2)
	{
		Lobby newLobby = new Lobby(session1, session2);
		Boolean hasSuccesfullyAdded = lobbies.add(newLobby);
		if(hasSuccesfullyAdded)
		{
			sessionsWithoutALobby.remove(0);
			sessionsWithoutALobby.remove(0);
			System.out.println("Lobby has succesfully been created");
		}
		else
		{
			System.out.println("Lobby has not been created");
		}
	}
}