import express from 'express'

import { deleteUser, getAllUsers, updateUser } from '../controllers/users'
import { canDeleteUser } from '../middlewares'

export default (router: express.Router) => {
    router.get('/users', getAllUsers)
    router.delete('/users/:id', canDeleteUser, deleteUser)
    router.patch('/users/:id', updateUser)
}
