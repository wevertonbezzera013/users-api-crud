import { createUser, getUserByEmail, getUserBySessionToken } from '../db/users'
import express from 'express'
import { authentication, random } from '../helpers'
import logger from '../logger'

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.sendStatus(400)
        }

        const user = await getUserByEmail(email).select(
            '+authentication.salt +authentication.password'
        )

        if (!user) {
            return res.sendStatus(400)
        }

        const expectedHash = authentication(
            user.authentication?.salt ?? '',
            password
        )

        if (user.authentication?.password !== expectedHash) {
            return res.sendStatus(403)
        }

        const salt = random()
        user.authentication!.sessionToken = authentication(
            salt,
            user._id.toString()
        )

        await user.save()

        res.cookie('APP-AUTH', user.authentication?.sessionToken ?? '', {
            domain: 'localhost',
            path: '/',
        })

        logger.info(`User logged in: ${user._id}`)
        return res.status(200).json(user).end()
    } catch (error) {
        logger.error('Error in login:', error)
        return res.sendStatus(400)
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body
        if (!email || !password || !username) {
            return res.sendStatus(400)
        }
        const existingUser = await getUserByEmail(email)

        if (existingUser) {
            return res.sendStatus(400)
        }

        const salt = random()
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        })

        logger.info(`User registered: ${user._id}`)
        return res.status(200).json(user).end()
    } catch (error) {
        logger.error('Error in register:', error)
        return res.sendStatus(400)
    }
}

export const logout = async (req: express.Request, res: express.Response) => {
    try {
        const sessionToken = req.cookies['APP-AUTH']

        if (!sessionToken) {
            logger.warn('Unauthorized access - User not logged in')
            return res
                .status(401)
                .json({ error: 'Unauthorized - User not logged in' })
        }

        const user = await getUserBySessionToken(sessionToken)

        if (!user) {
            logger.warn('Unauthorized access - Invalid session token')
            return res
                .status(401)
                .json({ error: 'Unauthorized - Invalid session token' })
        }

        if (user.authentication) {
            user.authentication.sessionToken = null

            await user.save()
        }

        res.clearCookie('APP-AUTH', { domain: 'localhost', path: '/' })

        logger.info(`User logged out: ${user._id}`)
        return res.status(200).json({ message: 'Logout successful' })
    } catch (error) {
        logger.error('Error in logout:', error)
        return res.sendStatus(500)
    }
}
