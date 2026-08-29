# Implementation Plan: Payment and Checkout

**Branch**: `feature/payment-checkout` | **Date**: 2026-08-29 | **Spec**: [`spec.md`](file:///Users/ad/Desktop/teesik/teesik/.specify/specs/payment-feature/spec.md)
**Input**: Feature specification from `/specs/payment-feature/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Triển khai tính năng thanh toán (Payment/Checkout) với 2 phương thức chính là Thanh toán khi nhận hàng (COD) và Thanh toán trực tuyến (ví điện tử/thẻ ngân hàng). Đồng thời, tái cấu trúc logic tính toán giỏ hàng, áp dụng mã giảm giá và kiểm tra tồn kho để đảm bảo mọi tính toán và xác thực phải được thực hiện ở Backend, thay thế việc tin tưởng dữ liệu giá và mã giảm giá từ Frontend hiện tại.

## Technical Context

**Language/Version**: TypeScript (Frontend), PHP 8.x (Backend)
**Primary Dependencies**: Next.js 15 (Frontend), Laravel 10 (Backend), GHN Shipping API, Payment Gateway API (VNPay/Momo)
**Storage**: Cơ sở dữ liệu mặc định của Laravel (MySQL/PostgreSQL) cho Order, OrderItem, PaymentTransaction.
**Testing**: Playwright (Frontend E2E), PHPUnit (Backend)
**Target Platform**: Web browsers (Desktop/Mobile)
**Project Type**: Web application (Frontend Next.js và Backend Laravel tách biệt)
**Performance Goals**: Quá trình tạo đơn hàng ở Backend phản hồi dưới 1 giây.
**Constraints**: Backend KHÔNG ĐƯỢC phép tin tưởng giá trị `price` hay `discount_amount` từ Frontend. Phải đồng bộ với API GHN.
**Scale/Scope**: Tương tác với giỏ hàng, checkout flow, quản lý đơn hàng.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Tính toàn vẹn dữ liệu: Không trust dữ liệu nhạy cảm từ client (Giải quyết "Checkout trusts client-side item prices").
- [x] Tính bảo mật: Xác thực mã giảm giá chặt chẽ ở Backend (Giải quyết "Invalid vouchers can still apply frontend discount").
- [x] Tính thực tế: Loại bỏ Payment endpoint mock hiện tại, thay bằng cổng thanh toán thực tế (hoặc luồng COD an toàn nếu dev) (Giải quyết "Payment endpoint is mock and exposed").

## Project Structure

### Documentation (this feature)

```
specs/payment-feature/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Optional research on Payment Gateways
├── data-model.md        # DB migrations & Models for Order/Payment
└── tasks.md             # Task breakdown
```

### Source Code (repository root)

```
teesik-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── OrderController.php (Sửa logic tính giá server-side)
│   │   │   └── PaymentController.php (Tích hợp VNPay/Momo thật)
│   │   └── Requests/
│   │       └── CreateOrderRequest.php (Validation mới)
│   ├── Services/
│   │   ├── Shipping/
│   │   │   └── GHNService.php (Tích hợp phí ship)
│   │   └── Payment/
│   │       └── PaymentGatewayService.php (Xử lý giao dịch)
│   └── Models/
│       ├── Order.php
│       ├── OrderItem.php
│       └── PaymentTransaction.php
└── routes/
    └── api.php (Các API endpoint cho Checkout và webhook thanh toán)

teesik/
├── app/
│   ├── checkout/
│   │   └── page.tsx (Sửa logic giỏ hàng, gọi API tính toán)
│   └── account/
│       └── orders/
│           └── page.tsx (Xem lịch sử thanh toán)
├── components/
│   └── checkout/
│       ├── PaymentMethods.tsx (UI chọn phương thức)
│       └── OrderSummary.tsx (Hiển thị tổng tiền an toàn từ API)
└── services/
    └── order.ts (API client cho Order/Payment)
```

**Structure Decision**: Cấu trúc ứng dụng phân tách Client (Next.js) và Server (Laravel). Trọng tâm thay đổi nằm ở Backend `OrderController` và `PaymentController` để bảo vệ tính toàn vẹn dữ liệu, đồng thời cập nhật Frontend `checkout/page.tsx` để đồng bộ với cấu trúc API mới.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Tính lại giá trên Backend | Tránh bị người dùng thao túng giá trên Frontend (như báo cáo trong AGENTS.md) | Chấp nhận giá Frontend (Rủi ro bảo mật nghiêm trọng). |
| Gọi API vận chuyển (GHN) thời gian thực | Phí ship phụ thuộc địa chỉ và khối lượng hàng | Dùng phí ship cố định (Không chính xác, gây thất thoát hoặc phiền hà cho user). |
