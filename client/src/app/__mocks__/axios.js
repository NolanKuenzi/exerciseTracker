/* eslint-disable */

const post = () => Promise.resolve({
  data: {
    userId: '90dG8Oo48',
    username: 'Kyle',
    description: 'running',
    duration: '45',
    date: '2019-06-25',
  },
});
let get = () => Promise.resolve({
  data: {
    userId: '90dG8Oo48',
    username: 'Kyle',
    count: '2',
    log: [
      {
        logId: 'm0dekgo33',
        description: 'jump rope',
        duration: '35',
        date: '2019-06-26',
      },
      {
        logId: '532eogodf',
        description: 'pushups',
        duration: '30',
        date: '2019-06-27',
      },
    ],
  },
});
const deleteFunc = () =>  Promise.resolve({
  data: {
    userId: '90dG8Oo48',
    username: 'Kyle',
    count: '2',
    log: [
       /* Entry deleted: 
       {
        logId: 'm0dekgo33',
        description: 'jump rope',
        duration: '35',
        date: '2019-06-26',
      }, */
      {
        logId: '532eogodf',
        description: 'pushups',
        duration: '30',
        date: '2019-06-27',
      },
    ],
  },
});

module.exports = {
  post: post,
  get: get,
  delete: deleteFunc,
}