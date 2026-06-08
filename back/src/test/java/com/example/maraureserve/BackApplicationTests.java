package com.example.maraureserve;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(
		classes = BackApplication.class,
		properties = {
				"spring.datasource.url=jdbc:h2:mem:marau_reserve;DB_CLOSE_DELAY=-1;MODE=MySQL",
				"spring.datasource.username=sa",
				"spring.datasource.password=",
				"spring.datasource.driver-class-name=org.h2.Driver",
				"spring.jpa.hibernate.ddl-auto=create-drop",
				"spring.jpa.show-sql=false"
		})
class BackApplicationTests {

	@Test
	void contextLoads() {
	}

}
