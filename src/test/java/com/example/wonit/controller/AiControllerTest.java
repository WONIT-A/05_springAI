package com.example.wonit.controller;


import com.example.wonit.service.ReportService;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.core.io.ByteArrayResource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.RETURNS_SELF;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AiControllerTest {

    @Test
    void category_returnsCategoryFromMockedAi() {
        ChatClient chatClient = mock(ChatClient.class, RETURNS_DEEP_STUBS);
        ChatClient.Builder builder = mock(ChatClient.Builder.class, RETURNS_SELF);

        when(builder.build()).thenReturn(chatClient);
        when(chatClient.prompt()
                .system(anyString())
                .user(anyString())
                .call()
                .content()).thenReturn("식비\n");

        AiController controller = new AiController(
                builder,
                mock(ReportService.class),
                mock(ChatMemory.class),
                new ByteArrayResource(new byte[0])
        );

        AiController.CategoryResponse response =
                controller.category(new AiController.CategoryRequest("점심 식사"));

        assertEquals("점심 식사", response.memo());
        assertEquals("식비", response.category());
    }
}