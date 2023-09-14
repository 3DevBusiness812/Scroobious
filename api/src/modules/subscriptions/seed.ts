// import { faker } from '@faker-js/faker';
import { getBindingError, logger } from 'warthog';
import { bindRemote, callAPISuccess } from '../../core';

async function seedDatabase() {
  const binding = await bindRemote();

  let events;
  try {
    const eventType = await callAPISuccess(
      binding.mutation.createEventType({
        data: {
          name: 'user.created',
          allowSubscription: true,
        },
      })
    );
    // console.log(eventType);
  } catch (err) {
    const error = getBindingError(err);
    logger.error(error);
  }

  return events;
}

seedDatabase()
  .then((result) => {
    logger.info(result);
    return process.exit(0);
  })
  .catch((err) => {
    logger.error(err);
    return process.exit(1);
  });

// for (let index = 0; index < NUM_USERS; index++) {
//   const random = new Date()
//     .getTime()
//     .toString()
//     .substring(8, 13);
//   const stringField = `${faker.name.firstName()} ${faker.name.lastName()}`;
//   const emailField = `${stringField
//     .substring(0, 1)
//     .toLowerCase()}${faker.name.firstName().toLowerCase()}-${random}@fakeemail.com`;

//   const jsonField = {
//     string: 'hello',
//     arrayOfObjects: [{ one: 2 }],
//     bool: false,
//     number: 1,
//     emptyObject: {},
//     emptyArray: []
//   };
//   const dateField = new Date().toISOString();
//   const dateOnlyField = new Date().toISOString().substring(0, 10);
//   const dateTimeField = new Date().toISOString();

//   const randomCharacter = () => {
//     return Array.from({ length: 1 }, () => Math.random().toString(36)[2]).join('');
//   };

//   const randomInt = (max = 10) => {
//     return Math.round(Math.random() * max);
//   };

//   const arrayOfInts = Array.from({ length: randomInt(4) }, () => randomInt());
//   const arrayOfStrings = Array.from({ length: randomInt(4) }, () => randomCharacter());

//   try {
//     const user = await binding.mutation.createUser(
//       {
//         data: {
//           emailField,
//           stringField,
//           jsonField,
//           dateField,
//           dateOnlyField,
//           dateTimeField,
//           enumField: 'FOO',
//           geometryField: {
//             type: 'Point',
//             coordinates: [faker.random.number(100), faker.random.number(200)]
//           },
//           arrayOfInts,
//           arrayOfStrings
//         }
//       },
//       `{ id emailField createdAt createdById }`
//     );
//     logger.info(user.emailField);
//   } catch (err) {
//     const error = getBindingError(err);
//     logger.error(emailField);
//     logger.error(error);
//   }
// }

// return server.stop();
