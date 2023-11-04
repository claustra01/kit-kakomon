import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method) {

    /*
      @param publisher: string // uid
      @param valid_count: int
      @param expired_at: datetime
    */
    case 'POST':
      const newInvitation = await req.body
      if (newInvitation == null) {
        res.status(400).json({ message: 'Request body is empty' })
        break
      }
      if (newInvitation.publisher == null || newInvitation.valid_count == null || newInvitation.expired_at == null) {
        res.status(400).json({ message: 'Missing one or more required parameters: publisher, valid_count, or expired_at' })
        break
      }
      try {
        console.log(newInvitation)
        const createdInvitation = await prisma.invitation.create({
          data: {
            publisherId: newInvitation.publisher,
            validCount: Number(newInvitation.valid_count),
            expiredAt: newInvitation.expired_at,
          }
        })
        res.status(200).json(createdInvitation)
        break
      } catch(error) {
        res.status(500).json({ message: error })
        break
      }

    /*
      @param id: string
    */
    case 'GET':
      const searchId = req.query.id
      if (searchId != null) {
        // if id is specified, search for the user with the id
        try {
          const searchedInvitation = await prisma.invitation.findUnique({
            where: {
              id: searchId.toString()
            }
          })
          if (searchedInvitation == null) {
            res.status(404).json({ message: 'Invitation not found' })
            break
          }
          res.status(200).json(searchedInvitation)
          break
        } catch(error) {
          res.status(500).json({ message: error })
          break
        }
      } else {
        // if id is not specified, return all invitations
        try {
          const allInvitations = await prisma.invitation.findMany({
            orderBy: {
              expiredAt: 'asc'
            }
          })
          res.status(200).json(allInvitations)
          break
        } catch(error) {
          res.status(500).json({ message: error })
          break
        }
      }

    /*
      @param id: string
    */
      case 'DELETE':
      const deleteId = req.query.id
      if (deleteId == null) {
        res.status(400).json({ message: 'Missing required parameter: id' })
        break
      }
      try {
        const deletedInvitation = await prisma.invitation.delete({
          where: {
            id: deleteId.toString()
          }
        })
        res.status(200).json(deletedInvitation)
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