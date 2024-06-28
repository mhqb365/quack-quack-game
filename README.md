# Quack Quack Game Tool - v5 beta

Chưa xong đâu mà đòi xài, đổi cấu trúc code hết rồi, nếu đọc hiểu được code thì có thể xài được 😅

## Giới thiệu

Tool cho Quack Quack Game

Windows / Mac / Linux đều dùng được miễn cài được NodeJS 👉 https://nodejs.org/en/download/prebuilt-installer

Người viết Tool là thợ sửa laptop 👉 https://tiktok.com/@mhqb365

Link Tool chính thức 👉 https://j2c.cc/quack

Mọi người có hứng thú với con game vô tri này thì tham gia ở đây 👉 https://t.me/quackquack_game_bot?start=6hn8Xrp7DK

## Tuyên bố miễn trừ trách nhiệm

Tui (mhqb365) là chủ sở hữu của những đoạn code trên, tuyên bố sẽ miễn trừ trách nhiệm khi bạn sử dụng những đoạn code này

Bạn có quyền sử dụng nó tùy ý, tuy nhiên xin lưu ý rằng trong mọi trường hợp, khi bạn sử dụng những đoạn code trên cho những mục đích xấu, sửa đổi hoặc những việc tương tự nhằm mục đích gây hại cho những cá nhân, tổ chức khác, bạn sẽ phải chịu trách nhiệm cho những việc đó. Tôi sẽ không phải chịu bất cứ trách nhiệm gì từ việc này

Chúc bạn sử dụng Tool vui vẻ

## Lưu ý

Mở tay đủ tối thiểu 15 con vịt trước khi chạy Tool

## Tính năng

Tự động lụm trứng

Tự động lụm ZỊT ZÀNG (cái con bạch tuột mỏ vịt lâu lâu xuất hiện, vì lý do bảo mật nên không lụm được TON nhé)

Tự động ấp trứng hiếm

Có thể tùy chọn chức năng để chạy Tool

Ngẫu nhiên chọn vị trí tổ rơm để lụm hoặc ấp trứng

Ngẫu nhiên thời gian lụm hoặc ấp trứng. Từ 1 đến maxSleepTime trong file ```config.json``` (đơn vị: giây)

Tool chạy hoàn toàn độc lập nhưng nếu bạn bật CFO thì sẽ xung đột với tính năng lụm trứng & ấp trứng

Đang cập nhật thêm cái gì đó...

## Tiêu chí ấp trứng

Khi chạy chức năng ấp trứng thì Tool sẽ tự chọn trứng hiếm nhất để ấp. Là loại trứng có rate thấp nhất theo bảng độ hiếm này

<img src="./images/2.jpg" />

Khi ấp được vịt thì dựa vào các thành phần của vịt để tính điểm

<img src="./images/3.jpg" />

- LEGENDARY : 3 điểm
- RARE : 2 điểm
- COMMON : 1 điểm

Vịt có tổng điểm cao hơn thì xịn hơn

Ví dụ vịt RARE + RARE + RARE sẽ bằng điểm với vịt LEGENDARY + RARE + COMMON

Để ấp được vịt nhiều điểm thì bạn cần có nhiều tổ rơm để tăng tỉ lệ ra trứng hiếm (xem lại bảng độ hiếm)

Khi ấp được vịt lỏ thì Tool sẽ tự động xóa luôn

Khi chạy chức năng ấp trứng thì Tool sẽ tự động xóa đi 1 con vịt lỏ nhất để nhường chổ khi FARM đầy

Tool sẽ tự động tắt tính năng ấp trứng khi FARM vịt max điểm

Nói chung cái tính năng ấp trứng này là hoàn toàn tự động, tiêu chí là tạo FARM toàn vịt xịn

## Cách dùng

Máy tính cần hiện đuôi file để thao tác dễ hơn (hiện đuôi file trên Windows bằng cách mở Start menu -> tìm File Explorer Options -> View -> bỏ tick Hide extentions for known file types -> OK)

<img src="./images/4.jpg" />

Chưa có hướng dẫn cho v5 beta này đâu

## Phần phụ

Xem lại lịch sử trong thư mục ```logs```

Lịch sử lụm ZỊT ZÀNG ở file ```golden_duck_ngày_tháng_năm.txt```

Lịch sử ấp trứng ở file ```farm_ngày_tháng_năm.txt```

Lịch sử lỗi ở file ```error_ngày_tháng_năm.txt```

Lịch sử khác ở file ```log_ngày_tháng_năm.txt```

## Các lỗi thường gặp

### SecurityError - UnauthorizedAccess

<img src="./images/12.jpg" />

Gặp lỗi trên chỉ cần dán dòng lệnh dưới đây vào rồi enter là được

```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ObjectNotFound - CommandNotFoundException

<img src="./images/13.jpg" />

Gặp lỗi này thì dùm ơn, kéo lên trên đọc kỹ lại từ đầu 🤦‍♂️ đã cài NodeJS đâu mà chẳng gặp lỗi này

### Lặp lại nhiều lần THIS_DUCK_NOT_ENOUGH_TIME_TO_LAY

<img src="./images/14.jpg" />

Lỗi này do vịt không đẻ kịp. Tự ấp thủ công thêm vịt để tránh lỗi này (vịt lỏ cũng được, tối thiểu 10 con)

### Không hiển thị emoji

<img src="./images/15.jpg" />

Cái này là do PowerShell / Cmd không hỗ trợ. Tải Terminal về cài vào rồi mở Tool bằng Terminal 👉 https://github.com/microsoft/terminal
