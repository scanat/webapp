import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Notifications {
  readonly id: string;
  readonly topic?: string;
  readonly description?: string;
  readonly status?: boolean;
  readonly subscriberId?: string;
  readonly expiry?: string;
  readonly image?: string;
  constructor(init: ModelInit<Notifications>);
  static copyOf(source: Notifications, mutator: (draft: MutableModel<Notifications>) => MutableModel<Notifications> | void): Notifications;
}

export declare class UserTable {
  readonly id: string;
  readonly saved?: string[];
  readonly orders?: string[];
  constructor(init: ModelInit<UserTable>);
  static copyOf(source: UserTable, mutator: (draft: MutableModel<UserTable>) => MutableModel<UserTable> | void): UserTable;
}