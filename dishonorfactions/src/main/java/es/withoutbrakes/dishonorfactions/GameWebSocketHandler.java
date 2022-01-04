package es.withoutbrakes.dishonorfactions;

import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class GameWebSocketHandler extends TextWebSocketHandler
{
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception
	{
		System.out.println("Meessage received: " + message.getPayload());
		
		String responseMessge = "Respuesta al mensaje: " + message.getPayload();
		session.sendMessage(new TextMessage(responseMessge));
	}
}