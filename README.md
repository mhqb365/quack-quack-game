# Quack Quack Game Tun

## Giới thiệu

Tun (Tool) tự động cho Quack Quack Game

Link tun chính thức 👉 https://j2c.cc/quack

Windows / Mac / Linux đều dùng được miễn cài được NodeJS

Người viết tun là thợ sửa laptop 👉 https://tiktok.com/@mhqb365

Mọi người có hứng thú với con game vô tri này thì tham gia link này 👉 https://t.me/quackquack_game_bot?start=6hn8Xrp7DK

Tìm hiểu về game ở đây 👉 https://whitepaper.quackquack.games

## Tuyên bố miễn trừ trách nhiệm

Tui (mhqb365) là chủ sở hữu của những đoạn code trên, tuyên bố sẽ miễn trừ trách nhiệm khi bạn sử dụng những đoạn code này

Bạn có quyền sử dụng nó tùy ý, tuy nhiên xin lưu ý rằng trong mọi trường hợp, khi bạn sử dụng những đoạn code trên cho những mục đích xấu, sửa đổi hoặc những việc tương tự nhằm mục đích gây hại cho những cá nhân, tổ chức khác, bạn sẽ phải chịu trách nhiệm cho những việc đó. Tôi sẽ không phải chịu bất cứ trách nhiệm gì từ việc này

Chúc bạn sử dụng tun vui vẻ

## Tính năng

Tự động lụm trứng

Tự động lụm ZỊT ZÀNG nhưngkhông lụm được TON

Chạy nhiều tài khoản cùng lúc

Dùng proxy cho các tài khoản

## Lưu ý cần biết

Bạn phải ấp thủ công đủ tối thiểu 15 con vịt rồi mới chạy tun

## Cách dùng

Máy tính cần hiện đuôi file để thao tác dễ hơn (hiện đuôi file trên Windows bằng cách mở Start menu -> tìm File Explorer Options -> View -> bỏ tick Hide extentions for known file types -> OK)

Cài NodeJS trước 👉 https://nodejs.org/en/download/prebuilt-installer

Tải code về -> giải nén ra folder

Mở Terminal / PowerShell / Cmd trong folder vừa giải nén được

Bỏ token game vào file ```token.txt```, mỗi dòng một token nếu chạy nhiều tài khoản

Nếu có nhiều tài khoản thì thêm proxy vào file ```proxy.txt```, mỗi dòng một proxy

Cấu trúc mỗi proxy như này 👉 host:port:username:password

Ví dụ: 192.168.10.215:8080:admin:p@ssword

Proxy ở dòng thứ mấy thì sẽ dùng cho token ở dòng tương ứng

Code tạo Bookmar để lấy token game
```js
javascript:var srcValue,token,copyToken,iframe=document.querySelector("iframe");function copyTextToClipboard(e){var t=document.createElement("textarea");t.textContent=e,document.body.appendChild(t),t.select(),document.execCommand("copy"),t.blur(),document.body.removeChild(t),alert("Token copied"),window.close()}iframe?window.location.hostname.includes("telegram")?open(iframe.getAttribute("src"),"_blank"):copyTextToClipboard(JSON.parse(localStorage.getItem("telegram-user")).state.token):alert("Open game first");
```

## Chạy tun

Nhập vào Terminal ```npm install``` để cài các thư viện cho tun (mỗi lần tải code mới về đều làm cái này)

Nhập vào Terminal ```node config``` để thiết lập ban đầu

Sửa file ```config.json``` để chạy tun theo ý mình, chỉ cần lưu ý các điểm sau:

```js
{
    "mode": 0, // chế độ chạy cho mỗi tài khoản; 0: lụm trứng + ZỊT ZÀNG; 1: chỉ lụm ZỊT ZÀNG
    "nest": 3 // số tổ rơm bạn đang có
    "showBalance": true // cho phép hiển thị số dư balance; true: cho phép; false: không cho hiển thị số dư
}
```

Nhập vào Terminal ```node quack``` để chạy tun

## Phần phụ

Xem lại lịch sử trong thư mục ```logs```

Lịch sử lụm ZỊT ZÀNG ở file ```golden_ngàythángnăm.txt```

Lịch sử lỗi ở file ```error_ngàythángnăm.txt```

## Các lỗi thường gặp

### 1. SecurityError - UnauthorizedAccess

Gặp lỗi trên chỉ cần dán dòng lệnh dưới đây vào rồi enter là được

```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
<img src="./images/12.jpg" />


### 2. ObjectNotFound - CommandNotFoundException

Lỗi này là do chưa cài NodeJS

<img src="./images/13.jpg" />

### 3. Lặp lại nhiều lần THIS_DUCK_NOT_ENOUGH_TIME_TO_LAY

Lỗi này do vịt không đẻ kịp. Tự ấp thủ công thêm vịt để tránh lỗi này, vịt lỏ cũng được, tối thiểu 15 con

<img src="./images/14.jpg" />

### 4. Không hiển thị emoji

Cái này là do PowerShell / Cmd không hỗ trợ. Tải Terminal về cài vào rồi mở tun bằng Terminal 👉 https://github.com/microsoft/terminal

<img src="./images/15.jpg" />
