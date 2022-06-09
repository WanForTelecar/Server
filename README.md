# 服务端
```
服务端作为遥控端和被控端的桥梁（信令服务）
```
## 功能

- [x] 提出 socket 连接服务 https://socket.io/get-started/private-messaging-part-2/
- [x] 提供房间功能（多房间），账号|密码验证
- [x] 退出 webrtc 将重启
- [x] 只允许 2 个设备通信（树莓派+遥控端）
- [x] 自动重连

## 教程
```
npm i
node index.js
```
### 进程守护
```
1. 使用 systemctl
```
### 注意
```
1. Nat 穿透用于 webrtc 通信，可以自己去搭建（随意）
2. Frp 需要自己搭建
3. sql 数据根据需要使用
```
