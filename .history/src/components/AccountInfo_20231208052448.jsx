import { MetaMaskAvatar } from 'react-metamask-avatar'
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

function GetAvatar({ address }) {
  return <MetaMaskAvatar address={address} size={address.size} />
}

function AccountInfo() {
  const [account, setAccount] = useState('')
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    const getAccountInfo = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        try {
          // Requesting accounts and obtaining the address directly
          const signer = provider.getSigner()
          const accounts = await signer.getAddress()
          setAccount(accounts)

          // Passing the correct parameter to GetAvatar
          const avatarComponent = <GetAvatar address={accounts} />
          setAvatar(avatarComponent)
        } catch (error) {
          console.error('Error while fetching account info:', error)
        }
      }
    }

    getAccountInfo()
  }, [])

  return (
    <div className="account-info">
      <div>
        <span>Address: {account}</span>
      </div>
      <div>
        <span>Avatar: {avatar}</span>
      </div>
    </div>
  )
}

export default AccountInfo
