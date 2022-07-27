import { ButtonInvisible } from '@primer/components'
import React from 'react'
import { Backlog } from 'src/types'
import { useWeb3 } from 'src/hooks/useWeb3'
import { SUPPORTED_CHAINS } from 'src/utils/constants'

type Props = {
  backlog: Backlog
}

export function ConnectedNetwork(props: Props) {
  const web3Context = useWeb3()
  let backlogChainId: number
  let networkChainId: number
  if (web3Context.hasOwnProperty('network')) {
    const network = web3Context.network
    networkChainId = network?.chainId
  }
  if (props.hasOwnProperty('backlog')) {
    backlogChainId = props?.backlog?.settings.chainId
  }

  if (web3Context.loading) {
    return null
  }

  return (
    <div>
      {networkChainId === undefined ||
      backlogChainId === undefined ? null : networkChainId ===
        backlogChainId ? (
        <ButtonInvisible
          css=""
          className="text-normal color-text-white border color-border-tertiary rounded px-2 py-1"
        >
          {SUPPORTED_CHAINS[backlogChainId].chainName}
        </ButtonInvisible>
      ) : (
        <ButtonInvisible
          css=""
          className="text-normal color-text-danger color-border-danger border  px-2 py-1"
          type="button"
          onClick={() =>
            web3Context.switchNetwork(
              backlogChainId,
              SUPPORTED_CHAINS[backlogChainId].chainId
            )
          }
        >
          Switch Network
        </ButtonInvisible>
      )}
    </div>
  )
}
