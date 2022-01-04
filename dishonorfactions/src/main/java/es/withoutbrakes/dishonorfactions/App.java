package es.withoutbrakes.dishonorfactions;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.config.annotation.*;

@SpringBootApplication
@EnableWebSocket
public class App implements WebSocketConfigurer
{
    public static void main( String[] args )
    {
        System.out.println( "Hello World!" );
        SpringApplication.run(App.class, args);
    }
    
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry)
    {
    	registry.addHandler(gameWebSocketHandler(), "/gameWebSocket").setAllowedOrigins("*");;
    }
    
    @Bean
    public GameWebSocketHandler gameWebSocketHandler()
    {
    	return new GameWebSocketHandler();
    }
}
