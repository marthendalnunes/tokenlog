import React, { useState } from 'react'
import { toUtf8Bytes } from '@ethersproject/strings'
import { hexlify } from '@ethersproject/bytes'
import { useBacklog } from 'src/hooks/useBacklog'
import { useVote } from 'src/hooks/useVote'
import { useWeb3 } from 'src/hooks/useWeb3'
import { Message, Vote } from 'src/types'
import { QuadraticVote } from './QuadraticVote'
import { StandardVote } from './StandardVote'
import { VOTE_VERSION } from '../utils/constants'

interface Props {
  number: number
}

export function ItemVote(props: Props) {
  const backlog = useBacklog()
  const web3Context = useWeb3()
  const voteContext = useVote()

  const [submittingVote, setSubmittingVote] = useState(false)
  const proposalVotesByUser = voteContext.proposalVotesByUser
  const votingPower = voteContext.votingPower

  async function submitVote(value: number) {
    setSubmittingVote(true)
    const message = {
      backlog: backlog.id,
      number: props.number,
      amount: value,
      version: VOTE_VERSION,
      timestamp: new Date().getTime(),
    }

    let signature = ''
    try {
      signature = await signMessage(message)
    }
    catch (ex) {
      console.log('Signing message failed or denied.', ex)
      setSubmittingVote(false)
      return false
    }

    if (signature) {
      const vote = {
        ...message,
        address: web3Context.address,
        state: 'OPEN',
        signature: signature,
      } as Vote

      console.log('Creating vote..', vote)
      const result = await voteContext.vote(vote)
      setSubmittingVote(false)
      return true
    }
    return false
  }

  async function signMessage(message: Message) {
    let signature = ''

    const signer = web3Context.provider.getSigner()
    if ((web3Context.provider.provider as any)?.wc) {
      signature = await web3Context.provider.send('personal_sign', [
        hexlify(toUtf8Bytes(JSON.stringify(message))),
        web3Context.address,
      ])
    } else {
      signature = await signer.signMessage(JSON.stringify(message))
    }

    return signature
  }

  return (
    <div>
      <h4>Vote</h4>
      <div>
        {!web3Context.address && (
          <p className="color-text-warning">
            <span
              className="tooltipped tooltipped-n"
              aria-label="Not enough voting power left"
            >
              ⚠️
            </span>
            <span className="ml-1">Connect your account first.</span>
          </p>
        )}

        {backlog.settings.method === 'QUADRATIC' ? (
          <QuadraticVote
            number={props.number}
            votingPower={votingPower}
            proposalVotes={proposalVotesByUser}
            onSubmit={submitVote}
            loading={submittingVote}
          />
        ) : (
          <StandardVote
            number={props.number}
            votingPower={votingPower}
            proposalVotes={proposalVotesByUser}
            onSubmit={submitVote}
            loading={submittingVote}
          />
        )}
      </div>
    </div>
  )
}
