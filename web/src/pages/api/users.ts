import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method) {

    /*
      @param id: string // firebase auth uid
      @param email: string
      @param entrance_year: int
      @param department: string
    */
    case 'POST':
      const newUser = await req.body
      if (newUser == null) {
        res.status(400).json({ message: 'Request body is empty' })
        break
      }
      if (newUser.id == null || newUser.email == null || newUser.entrance_year == null || newUser.department == null) {
        res.status(400).json({ message: 'Missing one or more required parameters: id, email, entrance_year, or department' })
        break
      }
      try {
        const CreatedUser = await prisma.users.create({
          data: {
            id: newUser.id,
            email: newUser.email,
            entranceYear: Number(newUser.entrance_year),
            department: newUser.department,
          }
        })
        res.status(200).json(CreatedUser)
        break
      } catch(error) {
        res.status(500).json({ message: error })
        break
      }

    /*
      @param id: string // firebase auth uid
    */
    case 'GET':
      const searchId = req.query.id
      if (searchId != null) {
        // if id is specified, search for the user with the id
        try {
          const searchedUser = await prisma.users.findUnique({
            where: {
              id: searchId.toString()
            }
          })
          if (searchedUser == null) {
            res.status(404).json({ message: 'User not found' })
            break
          }
          res.status(200).json(searchedUser)
          break
        } catch(error) {
          res.status(500).json({ message: error })
          break
        }
      } else {
        // if id is not specified, return all users
        try {
          const allUsers = await prisma.users.findMany({
            orderBy: {
              createdAt: 'asc'
            }
          })
          res.status(200).json(allUsers)
          break
        } catch(error) {
          res.status(500).json({ message: error })
          break
        }
      }
  
    /*
      @param id: string // firebase auth uid
      @param entrance_year: int
      @param department: string
      @param role: string
    */
    case 'PUT':
      const userData = req.body
      if (userData == null) {
        res.status(400).json({ message: 'Request body is empty' })
        break
      }
      if (userData.id == null || userData.entrance_year == null || userData.department == null || userData.role == null) {
        res.status(400).json({ message: 'Missing one or more required parameters: id, entrance_year, department, or role' })
        break
      }
      // データベース内の投稿データを更新
      try {
        const updatedUser = await prisma.users.update({
          where: {
            id: userData.id.toString()
          },
          data: {
            entranceYear: Number(userData.entrance_year),
            department: userData.department,
            role: userData.role,
          }
        })
        res.status(200).json(updatedUser)
        break
      } catch(error) {
        res.status(500).json({ message: error })
        break
      }

    default:
      res.status(405).json({ message: 'Method not allowed' })
      break
  
  }
}