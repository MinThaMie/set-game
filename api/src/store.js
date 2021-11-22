const ms = require('ms');
const redis = require('./redis');

module.exports = class Store {
  roomId(id) {
    return `room.${id}`;
  }

  async setRoom(id, data) {
    let room = this.getRoom(id);

    data = data || room.data || {};
    console.log("SET ROOM")
    await redis.set(this.roomId(id), JSON.stringify(data), 'EX', ms('24h'));
    console.log("set with redis")
  }

  async removeRoom(id) {
    return redis.del(this.roomId(id));
  }

  async getRoom(id) {
    console.log("I've reached store", id)
    let roomString = (await redis.get(this.roomId(id))) || '{}';
    console.log("redis knows", roomString)
    return JSON.parse(roomString);
  }
};
