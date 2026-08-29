# Feature Specification: Checkout and Payment (Thanh toán)

**Feature Branch**: `feature/payment-checkout`  
**Created**: 2026-08-29  
**Status**: Draft  
**Input**: User description: "tạo cho tôi 1 tính năng thanh toán"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Thanh toán bằng hình thức Nhận hàng trả tiền (COD) (Priority: P1)

Người dùng (khách hàng) có thể hoàn tất việc đặt hàng với phương thức thanh toán là COD để họ có thể trả tiền khi nhận được hàng.

**Why this priority**: COD là hình thức thanh toán phổ biến nhất và là MVP cốt lõi cho mọi nền tảng e-commerce tại Việt Nam. Tính năng này đảm bảo dòng chảy mua hàng (checkout flow) không bị tắc nghẽn kể cả khi cổng thanh toán online gặp sự cố.

**Independent Test**: Có thể được kiểm thử độc lập bằng cách chọn sản phẩm vào giỏ, điền địa chỉ giao hàng, chọn COD và bấm Đặt hàng. Hệ thống ghi nhận đơn hàng thành công và chuyển sang trang cảm ơn.

**Acceptance Scenarios**:

1. **Given** người dùng đang ở trang thanh toán với giỏ hàng có sản phẩm hợp lệ, **When** họ điền đầy đủ thông tin giao hàng, chọn phương thức thanh toán COD và nhấn "Đặt hàng", **Then** hệ thống sẽ tạo đơn hàng với trạng thái "Chờ xác nhận" và điều hướng người dùng tới trang thông báo đặt hàng thành công.
2. **Given** người dùng đang ở trang thanh toán, **When** họ không nhập địa chỉ nhận hàng nhưng nhấn "Đặt hàng", **Then** hệ thống sẽ báo lỗi yêu cầu nhập đầy đủ thông tin giao hàng.

---

### User Story 2 - Thanh toán trực tuyến qua cổng thanh toán (e.g., VNPay, Momo) (Priority: P2)

Người dùng có thể chọn thanh toán trước qua các cổng thanh toán điện tử hoặc thẻ ngân hàng để giao dịch diễn ra nhanh chóng, tiện lợi và không phải giữ tiền mặt khi nhận hàng.

**Why this priority**: Nâng cao trải nghiệm người dùng hiện đại và giảm thiểu rủi ro bom hàng (từ chối nhận hàng) cho chủ shop. Đây là bước thiết yếu sau khi đã có COD.

**Independent Test**: Có thể được kiểm thử bằng cách chọn thanh toán online, được điều hướng sang cổng thanh toán test (sandbox), thực hiện thanh toán giả lập và được điều hướng về lại website với thông báo thành công.

**Acceptance Scenarios**:

1. **Given** người dùng chọn phương thức thanh toán online (VD: VNPay) và nhấn "Đặt hàng", **When** hệ thống tạo đơn hàng tạm, **Then** người dùng được tự động chuyển hướng sang trang thanh toán của đối tác.
2. **Given** người dùng đang ở trang của cổng thanh toán, **When** họ hoàn tất giao dịch thành công và quay lại hệ thống, **Then** hệ thống cập nhật trạng thái đơn hàng thành "Đã thanh toán" và hiển thị trang cảm ơn.
3. **Given** người dùng đang ở trang của cổng thanh toán, **When** họ hủy giao dịch hoặc thanh toán thất bại, **Then** hệ thống hiển thị thông báo lỗi thanh toán và cho phép họ thử lại hoặc chọn hình thức khác.

---

### User Story 3 - Áp dụng mã giảm giá (Voucher) khi thanh toán (Priority: P2)

Người dùng có thể nhập và áp dụng mã giảm giá hợp lệ tại trang thanh toán để được trừ tiền trực tiếp vào tổng hóa đơn.

**Why this priority**: Khuyến mãi là động lực mua hàng lớn. Chức năng này cần được tính toán logic chặt chẽ cùng với quy trình tính tổng tiền đơn hàng.

**Independent Test**: Có thể kiểm thử độc lập bằng cách nhập mã giảm giá ở trang checkout và kiểm tra xem tổng tiền cuối cùng có được trừ đúng số tiền giảm hay không (phía Backend phải tính toán lại, không tin tưởng giá trị từ Frontend).

**Acceptance Scenarios**:

1. **Given** người dùng có một mã giảm giá hợp lệ (còn hạn, đủ điều kiện giá trị đơn), **When** họ nhập mã và bấm "Áp dụng", **Then** tổng tiền đơn hàng được cập nhật giảm trừ tương ứng.
2. **Given** người dùng có một mã giảm giá không hợp lệ (hết hạn/đã sử dụng), **When** họ nhập mã và bấm "Áp dụng", **Then** hệ thống báo lỗi voucher không hợp lệ và giữ nguyên tổng tiền.

---

### Edge Cases

- What happens when **sản phẩm trong giỏ hàng đột ngột hết hàng (out of stock) ngay lúc người dùng bấm "Đặt hàng"**? -> Hệ thống phải kiểm tra lại tồn kho (inventory check) ở Backend ngay trước khi tạo đơn; nếu hết hàng, trả về thông báo lỗi và yêu cầu người dùng cập nhật giỏ hàng.
- How does system handle **sự cố mất kết nối mạng hoặc timeout từ API bên thứ 3 (GHN tính phí ship, cổng thanh toán)**? -> Nếu tính phí ship lỗi, thông báo người dùng thử lại. Nếu chuyển hướng cổng thanh toán lỗi, tạo đơn hàng ở trạng thái "Chờ thanh toán" và cho phép thanh toán lại từ trang Quản lý đơn hàng.
- What happens when **Frontend gửi lên sai giá sản phẩm hoặc giá trị discount**? -> Backend tuyệt đối KHÔNG tin tưởng giá từ Frontend. Backend tự truy vấn giá sản phẩm trong DB và tự tính toán lại discount để đảm bảo tính toàn vẹn của dữ liệu (bảo mật kiến trúc - tham khảo Known Issues trong AGENTS.md).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST tính toán tổng tiền đơn hàng chính xác ở Backend (Subtotal = Giá sản phẩm * Số lượng; Total = Subtotal + Shipping Fee - Discount).
- **FR-002**: System MUST tích hợp với API của đơn vị vận chuyển (GHN) để lấy chính xác phí giao hàng dựa trên địa chỉ người dùng cung cấp.
- **FR-003**: System MUST xác thực toàn bộ dữ liệu giỏ hàng (giá cả, tồn kho) ở phía Server trước khi ghi nhận đơn.
- **FR-004**: System MUST hỗ trợ tối thiểu 2 phương thức thanh toán: Thanh toán khi nhận hàng (COD) và Thanh toán trực tuyến (ví điện tử/thẻ ngân hàng).
- **FR-005**: System MUST thay thế endpoint mock thanh toán hiện tại (`PaymentController.php`) bằng tích hợp cổng thanh toán thực tế (sandbox cho môi trường dev).
- **FR-006**: System MUST quản lý trạng thái thanh toán và trạng thái xử lý đơn hàng tách biệt (ví dụ: Payment Status: Unpaid/Paid; Order Status: Pending/Processing/Shipped).

### Key Entities *(include if feature involves data)*

- **Order**: Chứa thông tin tổng quan (Mã đơn, ID Khách hàng, Tổng tiền, Phí ship, Tiền giảm giá, Địa chỉ giao, Trạng thái đơn, Trạng thái thanh toán).
- **OrderItem**: Chứa thông tin chi tiết từng món hàng (ID Đơn hàng, ID Biến thể sản phẩm, Số lượng, Giá tại thời điểm mua).
- **PaymentTransaction**: Lưu lịch sử giao dịch (Mã đơn hàng, Mã giao dịch cổng thanh toán, Số tiền, Thời gian, Trạng thái giao dịch).
- **Voucher/Discount**: (Đã tồn tại) Được liên kết với Order khi áp dụng thành công.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% các đơn hàng được tạo đều có tổng tiền khớp chính xác với giá trị tính toán từ cơ sở dữ liệu (không bị ảnh hưởng bởi việc thao túng giá trên Frontend).
- **SC-002**: Người dùng có thể hoàn tất quy trình checkout từ giỏ hàng đến khi thấy thông báo thành công trong vòng dưới 2 phút.
- **SC-003**: Xóa bỏ hoàn toàn lỗ hổng bảo mật liên quan đến voucher không hợp lệ vẫn áp dụng được giảm giá trên Frontend (như đã ghi nhận trong AGENTS.md).
- **SC-004**: Tỷ lệ lỗi (error rate) trong quá trình tạo đơn ở Backend (bao gồm cả khi gọi API bên thứ 3 như GHN) phải dưới 2%.
