package es.withoutbrakes.dishonorfactions;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class GameWebSocketHandler extends TextWebSocketHandler
{
	private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
	private List<WebSocketSession> sessionsWithoutALobby = new ArrayList<WebSocketSession>();
	private List<Lobby> lobbies = new ArrayList<Lobby>();
	private ServerTraceCreator serverTraceCreator = ServerTraceCreator.getInstance();
	
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		serverTraceCreator.writeTraceMessage("Usuario conectado: " + session.getId());
		//System.out.println("Usuario conectado: " + session.getId());
		sessions.put(session.getId(), session);
		sessionsWithoutALobby.add(session);
		
		if(sessionsWithoutALobby.size() >= 2)
		{
			createLobby(sessionsWithoutALobby.get(0), sessionsWithoutALobby.get(1));
		}
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		serverTraceCreator.writeTraceMessage("Usuario desconectado: " + session.getId());
		//System.out.println("Usuario desconectado: " + session.getId());
		sessions.remove(session.getId());
		sessionsWithoutALobby.remove(session);
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception
	{		
		WebSocketSession opponent = getOpponentSession(session);
		if(opponent == null)
		{
			System.out.println("ERROR: The opponent is Null");
		}
		else
		{
			opponent.sendMessage(message);
		}
	}
	
	private WebSocketSession getOpponentSession(WebSocketSession session1)
	{
		int lobbyIndex = 0;
		Lobby lobby;
		while(lobbyIndex < lobbies.size())
		{
			lobby = lobbies.get(lobbyIndex);
			
			if(lobby.getSession1().getId().equals(session1.getId()))
			{
				return lobby.getSession2();
			}
			else if(lobby.getSession2().getId().equals(session1.getId()))
			{
				return lobby.getSession1();
			}
			
			lobbyIndex++;
		}
				
		return null;
	}
	
	private void createLobby(WebSocketSession session1, WebSocketSession session2) throws IOException
	{
		Lobby newLobby = new Lobby(session1, session2);
		Boolean hasSuccesfullyAdded = lobbies.add(newLobby);
		if(hasSuccesfullyAdded)
		{
			//Remove lobby players from Without lobby list
			sessionsWithoutALobby.remove(0);
			sessionsWithoutALobby.remove(0);
			
			//Send confirmation message to players
			TextMessage message = new TextMessage("PartidaEncontrada");
			newLobby.getSession1().sendMessage(message);
			newLobby.getSession2().sendMessage(message);
			serverTraceCreator.writeTraceMessage("Lobby between " + session1.getId() + " and " + session2.getId() + " has succesfully been created");
		}
		else
		{
			serverTraceCreator.writeTraceMessage("ERROR: Lobby between " + session1.getId() + " and " + session2.getId() + " has not been created");
		}
	}
}