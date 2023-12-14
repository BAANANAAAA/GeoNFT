import { MetaMaskAvatar } from 'react-metamask-avatar'
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

function GetAvatar({ address }) {
  return <MetaMaskAvatar address={{ address }} size={24} />
}

function AccountInfo() {
  const [account, setAccount] = useState('')
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    // 使用 ethers 获取账号信息
    const getAccountInfo = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        try {
          // 请求用户授权
          await window.ethereum.request({ method: 'eth_requestAccounts' })

          // 获取账号地址
          const signer = provider.getSigner()
          const accounts = await signer.getAddress()
          setAccount(accounts)

          // 获取头像信息（示例中使用假设的函数 getAvatarFromContract）
          const avatar = await getAvatarFromContract(accounts)
          setAvatar(avatar)
        } catch (error) {
          console.error('Error while fetching account info:', error)
        }
      }
    }

    getAccountInfo()
  }, []) // 空数组表示只在组件挂载时执行一次

  return (
    <div className="account-info">
      <div>
        <span>账号地址: {account}</span>
      </div>
      <div>
        <span>头像: {avatar}</span>
      </div>
    </div>
  )
}

export default AccountInfo
