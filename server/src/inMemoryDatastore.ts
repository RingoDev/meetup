import {User} from "./types/user";


let users:User[] = []
/**
 * @param name the name of the user
 * @return a {@link Promise} that resolves to the created {@link User}
 */
export function createUser(name: string) {

    users.push({name:name, _id:"TODO GENERATE"})

}

/**
 * Updates a User with certain id in DB
 * @param user
 * @return a {@link Promise} that resolves to the updated {@link User}
 */
export function updateUser(user: User) {
    for(let existingUser of users){
        if (existingUser._id === user._id) {
            existingUser.latitude = user.latitude
            existingUser.longitude = user.longitude
            existingUser.name = user.name
            return Promise.resolve(existingUser)
        }
    }
    Promise.reject("User didn't exist in the DB")
}

/**
 * Removes a User with certain id in DB
 * @param id
 * @return a {@link Promise} that resolves to the deleted {@link User}
 */
export function removeUser(id: string) {
    for (let user of users){
        if (user._id === id) {
            users.splice(users.indexOf(user), 1)
        }
    }
}

/**
 * Returns all  a User with certain id in DB
 * @param id
 * @return a {@link Promise} that resolves to all current {@link User}
 */
export function getAllUsers() {
    return users
}

export function getTestUsers() {
    const users = []

    users.push({
        name: "Testuser1",
        latitude: 48.33830196724644,
        longitude: 14.317141245631463,
    })
    users.push({
        name: "Testuser2",
        latitude: 48.34406412842475,
        longitude: 14.305296611071041,
    })
    users.push({
        name: "Testuser3",
        latitude: 48.31627424066361,
        longitude: 14.312077235203457
    })
    return users
}


function docToUser(doc: any): User | undefined {
    if (doc.name && doc._id) {
        return {
            name: doc.name,
            _id: doc._id,
            latitude: doc.latitude,
            longitude: doc.longitude
        }
    } else return
}

/**
 * Initializes DB by removing all users and inserting test users if they don't exist
 */
export function initializeDB() {
    // remove all Users on startup
    users = []

    // UserModel.deleteMany({}, (err) => {
        // for (let testUser of getTestUsers()) {
        //     UserModel.findOne({name: testUser.name},
        //         (_error, result) => {
        //             // if there was no user with the name -> create User
        //             if (result === null) {
        //                 console.log("Testuser was not in the db ")
        //                 const newUser = new UserModel(testUser)
        //                 newUser.save().then((result) => console.log("Testuser was saved to db ", result))
        //
        //             } else {
        //                 console.log("Testuser was in the db ", result)
        //             }
        //         })
        // }
    // })
}