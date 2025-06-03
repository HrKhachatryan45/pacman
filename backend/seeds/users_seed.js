const bcrypt = require('bcrypt');
const _ = require("lodash");

exports.seed = async function(knex) {
  const profileImageArray = [
    'https://www.freeiconspng.com/thumbs/pacman-png/pacman-red-png-4.png',
    'https://www.freeiconspng.com/thumbs/pacman-png/pacman-blue-png-10.png',
    'https://www.freeiconspng.com/thumbs/pacman-png/pacman-orange-png-26.png'
  ]

  // Deletes ALL existing entries
  const hashedPassword = await bcrypt.hash('myUn@iP@assw0rdAd4in', 10);
  await knex('users').del()
  await knex('users').insert({
    name:"admin",
    email:"hrahat.khachatryan04@mail.ru",
    password:hashedPassword,
    role:'admin',
    profileImage:profileImageArray[_.random(0,2)]
  });
};
