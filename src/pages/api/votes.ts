import type { NextApiRequest, NextApiResponse } from 'next'
import { Vote } from 'src/types'
import { MongoVotingRepository } from 'src/repository/voting'
import { Data } from './interfaces/data'

const repo = new MongoVotingRepository()

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data<Array<Vote>>>
) => {
  if (req.method !== 'POST')
    return res.status(405).json({ status: 405, message: 'Method Not Allowed' })
  
  const vote = JSON.parse(req.body)
  await repo.SubmitVote(vote)
  
  return res
    .status(200)
    .json({ status: 200, message: 'Vote successfully submitted!' })
}
