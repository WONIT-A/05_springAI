package com.example.wonit.controller;

import com.example.wonit.dto.CategorySpending;
import com.example.wonit.dto.MonthlySummary;
import com.example.wonit.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.YearMonth;
import java.util.List;

// 같은 리포트를 AI 도우미(BankTools)도 쓴다. REST 로도 열어 두었으니 AI 없이 Swagger · api.http 로 숫자를 확인할 수 있다
@Tag(name = "리포트 API", description = "내 계좌의 소비 · 월별 합계 (AI 도우미가 쓰는 숫자)")
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    // 🚧 아직 로그인(JWT)이 없다 → 데모 고객 1번(김연지)으로 고정. Day 2 JWT 에서 "토큰 주인" 으로 바꾼다
    static final Integer DEMO_CUSTOMER_ID = 1;

    @Operation(summary = "카테고리별 소비", description = "한 달 동안의 카테고리별 출금 합계 (month 생략 시 이번 달)")
    @GetMapping("/spending")
    public List<CategorySpending> spending(@RequestParam(required = false) YearMonth month) {
        return reportService.spending(DEMO_CUSTOMER_ID, month != null ? month : YearMonth.now());
    }

    @Operation(summary = "월별 입금 · 출금 합계", description = "최근 months 달 (1~12, 기본 3)")
    @GetMapping("/monthly")
    public List<MonthlySummary> monthly(@RequestParam(defaultValue = "3") int months) {
        return reportService.monthly(DEMO_CUSTOMER_ID, months);
    }
}
