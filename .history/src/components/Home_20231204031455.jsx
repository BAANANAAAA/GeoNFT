import WalletBalance from './WalletBalance'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import MyNFTABI from './abi.json'
import styles from './Home.css'

const contractAddress = '0xc5DD38D04CcDfCf7ff8bbe5F583bFc6af05Fd4FD'
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const contract = new ethers.Contract(contractAddress, MyNFTABI, signer)

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
    <div className={styles.container}>
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
  const contentId = 'Qme6Ckj2vQMw3TNhkiRoho9cyqADJfAXFRjrurUFVXkcWG'
  const metadataURI = `${contentId}/${tokenId}.json`
  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`

  const [isMinted, setIsMinted] = useState(false)

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI)
    console.log(result)
    setIsMinted(result)
  }

  useEffect(() => {
    getMintedStatus()
  }, [getMintedStatus])

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
      <img
        src={isMinted ? imageURI : 'img/placeholder.png'}
        alt={`NFT ${tokenId}`}
      />
      <h5>ID #{tokenId}</h5>
      {!isMinted ? (
        <button className={styles.button} onClick={mintToken}>
          Mint
        </button>
      ) : (
        <button className={styles.button} onClick={getURI}>
          Taken! Show URI
        </button>
      )}
    </div>
  )
}

export default Home
