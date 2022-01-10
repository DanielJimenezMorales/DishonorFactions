package es.withoutbrakes.dishonorfactions;

import java.time.format.DateTimeFormatter;  
import java.time.LocalDateTime;

public class ServerTraceCreator
{
	private static ServerTraceCreator singletonInstance;
	private DateTimeFormatter dateTimeFormatter;
	
	private ServerTraceCreator()
	{
		dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
	}
	
	public static ServerTraceCreator getInstance()
	{
		if(singletonInstance == null)
		{
			return new ServerTraceCreator();
		}
		
		return singletonInstance;
	}
	
	public void writeTraceMessage(String message)
	{
		System.out.println("[" + getCurrentDateTime() + "] " + message);
	}
	
	private String getCurrentDateTime()
	{
		return dateTimeFormatter.format(LocalDateTime.now());
	}
}
