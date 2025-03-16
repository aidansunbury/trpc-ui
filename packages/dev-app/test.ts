import superjson from "superjson";

const hi = {
  date: new Date(),
  nested: {
    text: "asdf",
  },
};
console.log(hi);
console.log(superjson.serialize(hi));

const result = {
  json: {
    date: "2025-03-16T22:49:03.994Z",
    nested: {
      text: "asdf",
    },
  },
  meta: {
    values: {
      date: ["Date"],
    },
  },
};
console.log(JSON.stringify(result));
const deserialized = superjson.deserialize(result);
console.log(deserialized);
console.log(deserialized.date.getFullYear());

// const data = {
//   json: {
//     date: "2020-06-20T04:56:50.293Z",
//     nested: {
//       nestedText: "asdf",
//     },
//   },
//   meta: {
//     values: {
//       date: ["Date"],
//     },
//   },
// };

// console.log(deserialized);
