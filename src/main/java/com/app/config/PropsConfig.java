// com.app.config.PropsConfig.java
// sns Spring MVC연동코드 
package com.app.config;

import org.springframework.context.annotation.*;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

@Configuration
@PropertySource(value = "classpath:application.properties", ignoreResourceNotFound = false)
public class PropsConfig {
  @Bean
  public static PropertySourcesPlaceholderConfigurer propertyConfigurer() {
    PropertySourcesPlaceholderConfigurer cfg = new PropertySourcesPlaceholderConfigurer();
    cfg.setIgnoreUnresolvablePlaceholders(false);
    return cfg;
  }
}
