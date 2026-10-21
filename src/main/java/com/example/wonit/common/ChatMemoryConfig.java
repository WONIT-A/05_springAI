package com.example.wonit.common;

// common/ChatMemoryConfig.java에서 메모리 개수 변경 후 로그 확인해보기

import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.InMemoryChatMemoryRepository;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class ChatMemoryConfig {

    @Bean
    ChatMemory chatMemory() {
        return MessageWindowChatMemory.builder()
                .chatMemoryRepository(new InMemoryChatMemoryRepository())
                .maxMessages(4) // 최근 4개 메시지(주고받고해서 2턴)을 기억
                .build();
    }
}