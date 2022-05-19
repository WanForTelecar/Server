const { Server } = require("socket.io")
const io = new Server({
    cors: {
        origin: ["*"]
    }
});
// 日志配置
const log4js = require("log4js");
log4js.configure({
    appenders: { socket: { type: "file", filename: "./socket.log" } },
    categories: { default: { appenders: ["socket"], level: "debug" } }
});
const logger = log4js.getLogger('socket');
// 房间
let rooms = [];
// 中间件剔除无效房间号及满员情况
io.use((socket, next) => {
    const { roomID, name } = socket.handshake.auth;
    const { address } = socket.handshake
    if (!roomID && !name) return next(new Error("invalid roomID or invalid userName"));
    // 找出是否有当前房间
    const state = findElem(rooms, 'roomID', roomID)
    if (state !== -1) {
        // 有房间
        const user = rooms[state].users
        if (user.length > 1) {
            return next(new Error("room is full"))
        } else {
            // 加入房间并通知其它用户
            user.push({ name: name, ip: address })
            socket.join(roomID);
            socket.broadcast.to(roomID).emit('joined', { name: name, roomID: roomID, Length: user.length, ip: address })
        }
        logger.debug(`${name}-${address}加入${roomID}号房间,人数：（${user.length}）`);
    } else {
        // 创建及加入房间并通知其它用户
        const obj = {
            roomID: roomID, //房间ID
            users: [{ name: name, ip: address }], //人员
        };
        rooms.push(obj);
        socket.join(roomID);
        socket.broadcast.to(roomID).emit("joined", { name: name, roomID: roomID, Length: obj.users.length, ip: address });
        logger.debug(`${name}-${address}加入${roomID}号房间,人数：（${obj.users.length}）`);
    }
    next();
})

io.on("connection", (socket) => {
    const { roomID, name } = socket.handshake.auth;
    const { address } = socket.handshake
    // 监听其它信息
    socket.on("msg", (data) => {
        // logger.debug(`${socket.handshake.auth.name}的信息`, data);
        // 转发消息
        socket.broadcast.to(roomID).emit("msg", data);
    });

    // 监听用户断开
    socket.on("disconnect", () => {
        for (let k = 0; k < rooms.length; k++) {
            const el = rooms[k];
            // 相同房间
            if (roomID === el.roomID) {
                for (let j = 0; j < el.users.length; j++) {
                    const es = el.users[j];
                    if (es.name === name && es.ip === address) {
                        // 通知其它人离开房间
                        el.users.splice(j, 1);
                        socket.broadcast.to(roomID).emit("leaved", {
                            name: name,
                            roomID: roomID,
                            Length: el.users.length,
                            ip: address
                        });
                        socket.leave(roomID)
                        break;
                    }
                }
            }
            // 没人就删除房间
            if (!el.users.length) {
                rooms.splice(k, 1);
            }
        }
        logger.debug(`${name}-${address}断开${roomID}号房间`);
        logger.debug(`所有房间：${JSON.stringify(rooms)}`);
    });
})

logger.debug(`socket服务启动：49800`)
io.listen(49800)

/**
 * 判断数组对象中是否有某个值
 * @param {*} array 要查询的数组
 * @param {*} attr 要查询的字段
 * @param {*} val 要查询的字段值
 */
function findElem (array, attr, val) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][attr] == val) {
            return i; //返回当前索引值
        }
    }
    return -1;
}
