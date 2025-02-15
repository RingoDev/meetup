import UserModel from "./models/User";
import { Document } from "mongoose";
import { User } from "./types/user";

/**
 * @param name the name of the user
 * @return a {@link Promise} that resolves to the created {@link User}
 */
export function createUser(name: string) {
  return new Promise<User>((resolve, reject) => {
    new UserModel({
      name: name,
      date: Date.now(),
    })
      .save()
      .then((value) => {
        console.log("Saved New User to DB", value);
        const user: User | undefined = docToUser(value);
        if (!user) reject("Invalid Document");
        else resolve(user);
      })
      .catch((err) => {
        console.log("Couldn't save User to DB", err);
        reject(err);
      });
  });
}

/**
 * Updates a User with certain id in DB
 * @param user
 * @return a {@link Promise} that resolves to the updated {@link User}
 */
export function updateUser(user: User) {
  return new Promise<User>((resolve, reject) => {
    UserModel.findOneAndUpdate(
      { _id: user._id },
      {
        date: Date.now(),
        longitude: user.longitude,
        latitude: user.latitude,
        name: user.name,
      },
      { new: true },
    ).then((doc) => {
      if (doc === null) {
        console.log("User didn't exist in the DB");
        reject("User didn't exist in the DB");
      } else {
        console.log("Updated User to", doc);
        const user: User | undefined = docToUser(doc);
        if (!user) reject("Invalid Document");
        else resolve(user);
      }
    });
  });
}

//todo check if val is a User
/**
 * Removes a User with certain id in DB
 * @param id
 * @return a {@link Promise} that resolves to the deleted {@link User}
 */
export function removeUser(id: string) {
  return new Promise((resolve, _) => {
    UserModel.findByIdAndDelete(id).then((val) => resolve(val));
  });
}

/**
 * Returns all Users
 * @return a {@link Promise} that resolves to all current {@link User}
 */
export function getAllUsers() {
  return new Promise<User[]>((resolve, reject) => {
    UserModel.find()
      .then((docs: Document[]) => {
        const result: User[] = [];
        for (let doc of docs) {
          const user = docToUser(doc);
          if (user) {
            result.push(user);
          }
        }
        resolve(result);
      })
      .catch((err: any) => reject(err));
  });
}

export function getTestUsers() {
  const users = [];

  users.push({
    name: "Amy",
    latitude: 48.33830196724644,
    longitude: 14.317141245631463,
  });
  // users.push({
  //   name: "Bob",
  //   latitude: 48.34406412842475,
  //   longitude: 14.305296611071041,
  // });
  return users;
}

function docToUser(doc: any): User | undefined {
  if (doc.name && doc._id) {
    return {
      name: doc.name,
      _id: doc._id,
      latitude: doc.latitude,
      longitude: doc.longitude,
    };
  } else return;
}

/**
 * Initializes DB by removing all users and inserting test users if they don't exist
 */
export function initializeDB() {
  // remove all Users on startup
  UserModel.deleteMany({}).then((result) => {
    console.log(`Deleted all ${result.deletedCount} Users`);
    for (let testUser of getTestUsers()) {
      const newUser = new UserModel(testUser);
      newUser
        .save()
        .then((result) => console.log("Testuser was saved to db ", result));
    }
  });
}
