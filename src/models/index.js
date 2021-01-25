// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Notifications, UserTable } = initSchema(schema);

export {
  Notifications,
  UserTable
};