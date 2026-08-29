---
description: "Task list for Payment and Checkout feature implementation"
---

# Tasks: Payment and Checkout

**Input**: Design documents from `/specs/payment-feature/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Khởi tạo thư mục component và service mới ở Frontend: `teesik/components/checkout/` và cập nhật `teesik/services/`
- [ ] T002 Khởi tạo cấu trúc service mới ở Backend: `teesik-backend/app/Services/Shipping/` và `teesik-backend/app/Services/Payment/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Cập nhật/Tạo database migrations cho các bảng `orders`, `order_items`, `payment_transactions`
- [ ] T004 [P] Tạo và cập nhật Eloquent Models: `teesik-backend/app/Models/Order.php`, `OrderItem.php`, `PaymentTransaction.php`
- [ ] T005 Khởi tạo service `GHNService.php` để gọi API tính phí ship (teesik-backend/app/Services/Shipping/GHNService.php)
- [ ] T006 Khởi tạo `CreateOrderRequest.php` để validate dữ liệu đầu vào (chỉ truyền ID biến thể và số lượng, cấm truyền giá)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Thanh toán bằng hình thức Nhận hàng trả tiền (COD) (Priority: P1) 🎯 MVP

**Goal**: Cho phép người dùng đặt hàng bằng COD. Hệ thống tự động tính tổng tiền ở backend dựa trên giá gốc sản phẩm trong DB và phí ship. Giải quyết lỗ hổng tin tưởng giá từ Frontend.

### Implementation for User Story 1

- [ ] T007 [P] [US1] Sửa `teesik-backend/app/Http/Controllers/OrderController.php`: Thêm logic truy xuất giá từ DB và tính tổng tiền đơn hàng thay vì nhận từ request (Bảo mật).
- [ ] T008 [US1] Cập nhật Frontend `teesik/services/order.ts`: Thêm hàm gọi API tạo đơn hàng (Create Order).
- [ ] T009 [US1] Sửa `teesik/app/checkout/page.tsx`: Gửi đúng cấu trúc dữ liệu lên backend (không truyền thuộc tính `price` lên server).
- [ ] T010 [P] [US1] Tạo/Sửa component `teesik/components/checkout/OrderSummary.tsx`: Hiển thị lại tổng tiền an toàn trả về từ API backend.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (COD hoạt động an toàn).

---

## Phase 4: User Story 2 - Thanh toán trực tuyến qua cổng thanh toán (Priority: P2)

**Goal**: Tích hợp cổng thanh toán (VNPay/Momo) để người dùng thanh toán trực tuyến, thay thế endpoint mock hiện tại.

### Implementation for User Story 2

- [ ] T011 [P] [US2] Tạo service `PaymentGatewayService.php` trong `teesik-backend/app/Services/Payment/`.
- [ ] T012 [US2] Cập nhật `teesik-backend/app/Http/Controllers/PaymentController.php`: Sửa endpoint mock thành gọi service VNPay/Momo để lấy URL thanh toán.
- [ ] T013 [US2] Tạo endpoint Webhook/Return URL trong `PaymentController.php` và định tuyến lại trong `routes/api.php` để xử lý kết quả trả về từ cổng thanh toán.
- [ ] T014 [P] [US2] Tạo component `teesik/components/checkout/PaymentMethods.tsx`: Thêm tùy chọn ví điện tử/thẻ ngân hàng.
- [ ] T015 [US2] Cập nhật `teesik/app/checkout/page.tsx`: Thêm logic điều hướng sang trang thanh toán của đối tác nếu phương thức không phải là COD.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Áp dụng mã giảm giá (Voucher) khi thanh toán (Priority: P2)

**Goal**: Áp dụng voucher và đảm bảo backend tự xác thực lại voucher thay vì tin tưởng số tiền giảm từ frontend.

### Implementation for User Story 3

- [ ] T016 [P] [US3] Sửa logic áp dụng voucher trong `teesik-backend/app/Http/Controllers/OrderController.php`: Gọi logic xác thực voucher từ DB. Nếu không hợp lệ thì throw Exception.
- [ ] T017 [US3] Cập nhật `routes/api.php`: Khóa endpoint `POST /v1/vouchers/refresh` bằng middleware auth admin (hoặc xóa đi) theo như phân tích bảo mật.
- [ ] T018 [P] [US3] Cập nhật Frontend `teesik/app/checkout/page.tsx`: Xử lý hiển thị báo lỗi khi backend từ chối voucher.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T019 [P] Viết Unit Test cho logic tính tổng tiền của `OrderController.php` trong `teesik-backend/tests/Feature/Order/`
- [ ] T020 [P] Cập nhật E2E Test cho luồng Checkout bằng Playwright trong `teesik/tests-e2e/`
- [ ] T021 Code cleanup và kiểm tra lại hiệu năng khi gọi nhiều API (GHN, Payment).

---

## Dependencies & Execution Order

- **Phase 1 & 2** bắt buộc phải hoàn tất trước tiên.
- Khi hoàn tất **Phase 2**, có thể chạy **US1 (Phase 3)**.
- Khi hoàn tất **Phase 3**, **US2** và **US3** có thể được triển khai song song bởi hai luồng công việc độc lập. 
- Mọi logic Backend (Tính giá, Voucher) ưu tiên làm trước để đảm bảo chuẩn API contract cho Frontend ráp nối.
