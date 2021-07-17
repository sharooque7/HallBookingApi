let room = [];
room.booking = { Ragul: ["fnjf", "fjjf"] };
const a = room.filter((roo) => {
  if (roo.booking.length === 0) {
    return true;
  }
});
//console.log(a.length);
console.log(room.booking);
for (i in room.booking) {
  console.log(room.booking[i].includes("fnjf"));
  if (room.booking[i].includes("fnjf")) {
    let index = room.booking[i].indexOf("fnjf");
    if (index > -1) {
      room.booking[i].splice(index, 1);
    }
  }
}
console.log(room.booking);
for (i in room.booking) {
  if (i === "Ragul") {
    room.booking[i].push("sharooqy");
  }
}

console.log(room.booking);
