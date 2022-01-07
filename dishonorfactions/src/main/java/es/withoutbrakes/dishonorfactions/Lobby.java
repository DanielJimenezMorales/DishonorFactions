package es.withoutbrakes.dishonorfactions;

import org.springframework.web.socket.WebSocketSession;

public class Lobby
{
	private WebSocketSession session1;
	private WebSocketSession session2;
	
	public Lobby(WebSocketSession player1, WebSocketSession player2)
	{
		session1 = player1;
		session2 = player2;
	}

	public WebSocketSession getSession1() {
		return session1;
	}

	public void setSession1(WebSocketSession session1) {
		this.session1 = session1;
	}

	public WebSocketSession getSession2() {
		return session2;
	}

	public void setSession2(WebSocketSession session2) {
		this.session2 = session2;
	}
}
