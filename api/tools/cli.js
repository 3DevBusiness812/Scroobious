#!/usr/bin/env node
const axios = require('axios');

const util = require('util');
const yargs = require('yargs/yargs');

const argv = yargs(process.argv.slice(2)).options({
  a: {
    choices: ['create-user', 'update-user', 'delete-user', 'create-event'],
    demandOption: true,
    alias: 'action',
  },
}).argv;

async function handleCLI() {
  if (argv.action === 'create-user') {
    await createUser();
  } else if (argv.action === 'update-user') {
    await updateUser();
  } else if (argv.action === 'delete-user') {
    await deleteUser();
  } else if (argv.action === 'create-event') {
    await createEvent();
  } else {
    console.error('Bad action');
  }
}

async function makeAPICall(query) {
  const result = await axios({
    url: 'http://localhost:4100/graphql',
    method: 'POST',
    data: {
      query,
    },
  });

  // console.log(JSON.stringify(result.data, undefined, 2));
  return result;
}

async function createEvent() {
  return makeAPICall(`
        mutation {
          createEvent(data: {
            type: "user.created",  
            ownerId: "1234"
            payload: {
              firstName: "Lee",
              lastName: "Orlandi",
              email: "goldcaddy77+lee@gmail.com"
          }
        }) {
          id
          type
          ownerId
          payload
        }
      }`);
}

async function createUser() {
  const slug = new Date().getTime();
  return makeAPICall(`
        mutation {
          createUser(data: {
            firstName: "Test", 
            lastName: "User", 
            email: "goldcaddy77+${slug}@gmail.com"
          }) {
            id
            email
            firstName
            lastName
          }
      }`);
}

async function updateUser() {
  const slug = new Date().toISOString();
  return makeAPICall(`
      mutation {
        updateUser(data: {firstName: "first-${slug}", lastName: "last-${slug}"}, where: {id: "9y44hy-ml"}) {
          id
          email
          firstName
          lastName
        }
      }
  `);
}

async function deleteUser() {
  return makeAPICall(`
      mutation {
        deleteUser(where: {id: "38I-0KCnf"}) {
          id
        }
      }
  `);
}

handleCLI()
  .then(() => console.log())
  .catch((err) => {
    if (err.response && err.response.data) {
      return console.error(err.response.data);
    }
    if (err.code || err.message) {
      return console.error(err.code || err.message);
    }
    console.error(err);
  });
