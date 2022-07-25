import { ButtonPrimary, TextInput } from '@primer/components'
import React, { useState } from 'react'

interface Props {
  number: number
  votingPower: number
  proposalVotes: { [key: number]: number }
  loading?: boolean
  onSubmit: (value: number) => Promise<boolean>
}

export function StandardVote(props: Props) {
  const itemCost = props.proposalVotes.hasOwnProperty(props.number)
    ? props.proposalVotes[props.number]
    : 0
  const usedVotingPower = Object.values(props.proposalVotes).reduce(
    (vote1: number, vote2: number) => vote1 + vote2,
    0
  )
  const maxVotes = Math.floor(props.votingPower - usedVotingPower)
  const [voteAmount, setVoteAmount] = useState(1)
  const [cost, setCost] = useState(itemCost)

  async function onSubmit() {
    if (await props.onSubmit(voteAmount)) {
      setCost((prevState) => prevState + voteAmount)
    }
  }

  function onChange(event) {
    const targetValue = event.target.value
    setVoteAmount(
      targetValue < 1
        ? 1
        : targetValue > maxVotes
        ? Math.floor(maxVotes)
        : parseInt(targetValue)
    )
  }

  function disableSubmit() {
    return voteAmount > maxVotes || props.loading
  }

  return (
    <div>
      <p>You can spend a maximum of {maxVotes} votes.</p>
      <p>You already have {itemCost} votes on this item.</p>
      {cost > maxVotes && (
        <p className="color-text-warning">
          <span
            className="tooltipped tooltipped-n"
            aria-label="Does not meet accessibility standards"
          >
            ⚠️
          </span>
          <span className="ml-1">Not enough votes left.</span>
        </p>
      )}
      <p>
        <TextInput
          className="width-full"
          css=""
          variant="large"
          type="number"
          width={100}
          aria-label="Amount of votes"
          value={voteAmount}
          onChange={onChange}
          name="votes"
          placeholder="Amount of votes..."
        />
      </p>
      <p>
        <ButtonPrimary css="" disabled={disableSubmit()} onClick={onSubmit}>
          Submit
        </ButtonPrimary>
        <small className="ml-2">
          * This vote will bring you to a total of {voteAmount + itemCost}{' '}
          votes.
        </small>
      </p>
    </div>
  )
}
