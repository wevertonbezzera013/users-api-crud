import express from 'express'
import { UserModel, deleteUserById, getUserById } from '../db/users'

export const getAllUsers = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        console.log('Received GET request for /users')
        const users = await getAllUsersIncludingDeleted()
        console.log('Sending response:', users)
        return res.status(200).json(users)
    } catch (error) {
        console.log('Error processing GET request for /users:', error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const getAllUsersIncludingDeleted = () => {
    return UserModel.find()
}

export const deleteUser = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params
        const deletedUser = await deleteUserById(id)

        if (!deletedUser) {
            console.log(`User not found with id: ${id}`)
            return res.status(404).json({ error: 'User not found' })
        }

        console.log(`User deleted: ${deletedUser._id}`)
        return res.json(deletedUser)
    } catch (error) {
        console.log('Error in deleteUser:', error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const updateUser = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params
        const { username, email } = req.body

        if (!username && !email) {
            console.log(
                'At least one field (username or email) is required for update'
            )
            return res.status(400).json({
                error: 'At least one field (username or email) is required for update',
            })
        }

        const user = await getUserById(id)

        if (!user) {
            console.log(`User not found with id: ${id}`)
            return res.status(404).json({ error: 'User not found' })
        }

        if (username) {
            user.username = username
        }

        if (email) {
            user.email = email
        }

        await user.save()

        console.log(`User updated: ${user._id}`)
        return res.status(200).json(user).end()
    } catch (error) {
        console.log('Error in updateUser:', error)
        return res.sendStatus(500)
    }
}
