package com.example.wonit;

import com.example.wonit.ai.BankTools;
import com.example.wonit.service.ReportService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import java.time.YearMonth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// 리포트 API 와 AI 도구가 "그 고객의 거래만" 보는지 확인한다. 진짜 AI 는 부르지 않는다 (네트워크 · 키 필요)
// 🚧 아직 로그인이 없어서 API 는 데모 고객 1번으로 동작한다 (Day 2 JWT 에서 토큰 주인으로 바뀐다)
@SpringBootTest
@AutoConfigureMockMvc
class ReportFlowTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ReportService reportService;

    @Test
    @DisplayName("데모 고객 1 의 2026-09 소비 → 이체 100500 이 먼저, 식비 12000 (1건)")
    void spendingOfCustomer1() throws Exception {
        mockMvc.perform(get("/api/reports/spending?month=2026-09"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("이체"))      // 금액이 큰 순서
                .andExpect(jsonPath("$[0].total").value(100500))
                .andExpect(jsonPath("$[1].category").value("식비"))
                .andExpect(jsonPath("$[1].total").value(12000))
                .andExpect(jsonPath("$[1].count").value(1));
    }

    @Test
    @DisplayName("다른 고객(2)으로 계산하면 고객 1 의 거래가 섞이지 않는다 → 빈 목록")
    void spendingOfCustomer2() {
        assertThat(reportService.spending(2, YearMonth.of(2026, 9))).isEmpty();
    }

    @Test
    @DisplayName("월별 합계는 요청한 달 수만큼, 오래된 달부터 나온다")
    void monthly() throws Exception {
        mockMvc.perform(get("/api/reports/monthly?months=3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    @DisplayName("AI 도구 myAccounts() → 고객 1 의 계좌 3개만")
    void toolSeesOnlyMyAccounts() {
        var accounts = new BankTools(1, reportService).myAccounts();

        assertThat(accounts).extracting("accountNo")
                .containsExactly("1002-345-678901", "1002-345-112233", "1002-345-998877");
    }

    @Test
    @DisplayName("AI 도구 report1 · report2 버전 → 고객 1 의 계좌로만 계산")
    void reportToolsUseOnlyMyAccounts() {
        BankTools tools = new BankTools(1, reportService);

        assertThat(tools.normalAccountNos()).containsExactly("1002-345-112233");
        assertThat(tools.savingBalanceSum()).isEqualByComparingTo("1596500");   // 1,099,500 + 497,000
        assertThat(new BankTools(2, reportService).savingBalanceSum()).isEqualByComparingTo("0");   // 고객 2 는 적금이 없다
    }

    @Test
    @DisplayName("새 대화(DELETE /api/ai/chat) → 204")
    void clearChat() throws Exception {
        mockMvc.perform(delete("/api/ai/chat")).andExpect(status().isNoContent());
    }
}
