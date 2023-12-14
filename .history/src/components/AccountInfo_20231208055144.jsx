import { MetaMaskAvatar } from 'react-metamask-avatar'
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './AccountInfo.css'

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
          const signer = provider.getSigner()
          const accounts = await signer.getAddress()
          setAccount(accounts)

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
      <div className="info-container">
        <span className="avatar">{avatar}</span>
        <span className="address">Address: {account}</span>
      </div>
    </div>
  )
}

export default AccountInfo
