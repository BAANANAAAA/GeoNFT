import React, { useState, useEffect } from 'react'
import WalletBalance from './WalletBalance'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ethers } from 'ethers'
import MyNFTABI from './abi.json'
import styles from './Home.css'
import placeholder from './placeholder.png'

const contractAddress = '0xc5DD38D04CcDfCf7ff8bbe5F583bFc6af05Fd4FD'
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const contract = new ethers.Contract(contractAddress, MyNFTABI, signer)

function Home() {
  const [totalMinted, setTotalMinted] = useState(0)
  const [userCID, setUserCID] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (submitted) {
      getCount()
    }
  }, [submitted])

  const getCount = async () => {
    const count = await contract.count()
    console.log(parseInt(count))
    setTotalMinted(parseInt(count))
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  return (
    <div>
      <div className="bg-dark text-white p-1">
        <h1 className="NFTWord">AbstractNFT!</h1>
      </div>

      <div className={`container ${styles.container}`}>
        <WalletBalance />
        <div>
          <h5>CID here:</h5>
          <input
            type="text"
            placeholder="Enter CID"
            value={userCID}
            onChange={(e) => setUserCID(e.target.value)}
            style={{ width: '500px' }}
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
        {submitted && (
          <div className="row" style={{ marginTop: '100px' }}>
            {Array(totalMinted + 1)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="col-md-3 mb-4">
                  {/* Assuming NFTImage is a component that uses the contract */}
                  <NFTImage tokenId={i} getCount={getCount} userCID={userCID} />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

function NFTImage({ tokenId, getCount, userCID }) {
  const contentId = 'Qme6Ckj2vQMw3TNhkiRoho9cyqADJfAXFRjrurUFVXkcWG'
  const metadataURI = `${contentId}/${tokenId}.json`
  const imageURI = userCID
    ? `https://gateway.pinata.cloud/ipfs/${userCID}/0.png`
    : placeholder

  const [isMinted, setIsMinted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const mintTimeoutRef = useRef(null)

  setIsLoading(true)

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI)
    console.log(result)
    setIsMinted(result)
  }

  useEffect(() => {
    getMintedStatus()
  }, [getMintedStatus])

  const mintToken = async () => {
    setIsLoading(true)

    let progressValue = 0
    const interval = setInterval(() => {
      progressValue += 5
      setProgress(progressValue)
    }, 200)

    mintTimeoutRef.current = setTimeout(async () => {
      clearInterval(interval)

      const connection = contract.connect(signer)
      const addr = connection.address
      const result = await contract.payToMint(addr, metadataURI, {
        value: ethers.utils.parseEther('0.05'),
      })

      await result.wait()
      getMintedStatus()
      getCount()

      setIsLoading(false)
      setProgress(0)
    }, 2000)
  }

  async function getURI() {
    const uri = await contract.tokenURI(tokenId)
    alert(uri)
  }

  return (
    <div className="card" style={{ width: '18rem' }}>
      <img
        src={isMinted ? imageURI : placeholder}
        className="card-img-top"
        alt={`NFT ${tokenId}`}
      />
      <div className="card-body">
        <h5 className="card-title">ID #{tokenId}</h5>
        {isLoading ? (
          <div>
            <div className="progress mb-2">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"></div>
            </div>
            <button className="btn btn-primary" disabled>
              Minting...
            </button>
          </div>
        ) : !isMinted ? (
          <button className="btn btn-primary" onClick={mintToken}>
            Mint
          </button>
        ) : (
          <button className="btn btn-success" onClick={getURI}>
            Taken! Show URI
          </button>
        )}
      </div>
    </div>
  )
}

export default Home
