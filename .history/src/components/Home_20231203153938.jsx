import WalletBalance from './WalletBalance'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import MyNFTABI from './abi.json'

const contract = new ethers.Contract(contractAddress, MyNFTABI, signer)
const contractAddress = '0xfd1B242Ee77d434BbF0432B1351c30CaB5dE50F1'
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

function Home() {
  const [totalMinted, setTotalMinted] = useState(0)

  useEffect(() => {
    getCount()
  }, [])

  const getCount = async () => {
    const count = await contract.count()
    console.log(parseInt(count))
    setTotalMinted(parseInt(count))
  }

  return (
    <div>
      <WalletBalance />

      {Array(totalMinted + 1)
        .fill(0)
        .map((_, i) => (
          <div key={i}>
            {/* Assuming NFTImage is a component that uses the contract */}
            <NFTImage tokenId={i} getCount={getCount} />
          </div>
        ))}
    </div>
  )
}

function NFTImage({ tokenId, getCount }) {
  const contentId = 'PINATA_CONTENT_ID'
  const metadataURI = `${contentId}/${tokenId}.json`
  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`

  const [isMinted, setIsMinted] = useState(false)
  useEffect(() => {
    getMintedStatus()
  }, [isMinted])

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI)
    console.log(result)
    setIsMinted(result)
  }

  const mintToken = async () => {
    const connection = contract.connect(signer)
    const addr = connection.address
    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.utils.parseEther('0.05'),
    })

    await result.wait()
    getMintedStatus()
    getCount()
  }

  async function getURI() {
    const uri = await contract.tokenURI(tokenId)
    alert(uri)
  }
  return (
    <div>
      <img src={isMinted ? imageURI : 'img/placeholder.png'}></img>
      <h5>ID #{tokenId}</h5>
      {!isMinted ? (
        <button onClick={mintToken}>Mint</button>
      ) : (
        <button onClick={getURI}>Taken! Show URI</button>
      )}
    </div>
  )
}

export default Home
