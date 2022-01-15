package es.withoutbrakes.dishonorfactions;

import java.time.format.DateTimeFormatter;
import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.time.LocalDateTime;

public class ServerTraceCreator
{
	private static ServerTraceCreator singletonInstance;
	private DateTimeFormatter dateTimeFormatter;
	
	private ServerTraceCreator()
	{
		dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
		clearTXT();
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
		writeLogInTXT("[" + getCurrentDateTime() + "] " + message);
	}
	
	private String getCurrentDateTime()
	{
		return dateTimeFormatter.format(LocalDateTime.now());
	}
	
	private void writeLogInTXT(String message)
	{
		try
		{
			FileOutputStream fos = new FileOutputStream("serverTrace.txt", true);
			BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(fos));
			
			bw.write(message);
			bw.newLine();
			
			bw.close();
		}
		catch(IOException e)
		{
			System.out.println(e);
		}
	}
	
	private void clearTXT()
	{
		try
		{
			FileOutputStream fos = new FileOutputStream("serverTrace.txt", false);
			BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(fos));
			
			bw.write("SERVER TRACE:");
			bw.newLine();
			
			bw.close();
		}
		catch(IOException e)
		{
			System.out.println(e);
		}
	}
}
