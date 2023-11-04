import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method) {

    /*
      @param id: string // firebase auth uid
      @param admin_id: string // firebase auth uid
      @param role: string
    */
    case 'PUT':
      const roleData = await req.body
      if (roleData == null) {
        res.status(400).json({ message: 'Request body is empty' })
        break
      }
      if (roleData.id == null || roleData.admin_id == null || roleData.role == null) {
        res.status(400).json({ message: 'Missing one or more required parameters: id, admin_id, or role' })
        break
      }
      if (roleData.id === roleData.admin_id) {
        res.status(403).json({ message: 'Cannot change your own role' })
        break
      }
      try {
        // check admin role
        const adminUser = await prisma.user.findUnique({
          where: {
            id: roleData.admin_id.toString()
          }
        })
        if (adminUser == null) {
          res.status(404).json({ message: 'User not found' })
          break
        }
        if (adminUser.role != 'ADMIN') {
          res.status(403).json({ message: 'Permission denied' })
          break
        }
        // edit role
        const updatedUser = await prisma.user.update({
          where: {
            id: roleData.id.toString()
          },
          data: {
            role: roleData.role,
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