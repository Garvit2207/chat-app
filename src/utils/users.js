const users = []

const addUser = ({id, username, room})=>{

    //clean the data
    username = username.trim()
    room  = room.trim().toLowerCase()

    // Validate the data
    if(!username || !room){
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user

    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username 
    })

    if(existingUser){
        return {
            error: 'Username is in use'
        }
    }

    //store user
    const user = {id, username, room}
    users.push(user)
    return { user }

}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })

    if(index!=-1){
        return users.splice(index, 1)[0]
    }

}

const getUser = (id)=>{
    const index = users.find((user)=>{
        return user.id === id
    })
    return index
}

const getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase()
    const Users = users.filter((user)=>{
        return user.room = room
    })
    return Users
}


module.exports= {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}