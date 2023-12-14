import React, { useState, useEffect, useRef } from 'react'
import WalletBalance from './WalletBalance'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ethers } from 'ethers'
// import MyNFTABI from './abi.json'
import MyNFTABI from './new_abi.json'
import styles from './Home.css'
import placeholder from './placeholder.png'

// const contractAddress = '0xc5DD38D04CcDfCf7ff8bbe5F583bFc6af05Fd4FD'
const contractAddress = '0x3B93866ca06f6BD9d6F55f6FEcE937dde6AB7D6b'
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const contract = new ethers.Contract(contractAddress, MyNFTABI, signer)

function Home() {
  const [totalMinted, setTotalMinted] = useState(0)
  const [userCID, setUserCID] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isHovered0, setIsHovered0] = useState(false)
  const [isHovered1, setIsHovered1] = useState(false)

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
      <div className={`container ${styles.container}`}>
        <div className="col-md-4">
          <div
            className={`container mt-4 bg-white bg-opacity-75 p-4 rounded ${
              isHovered0 ? 'hovered' : ''
            }`}
            onMouseEnter={() => setIsHovered0(true)}
            onMouseLeave={() => setIsHovered0(false)}>
            <WalletBalance />
          </div>
        </div>

        <div className="col-md-4">
          <div
            className={`container mt-4 bg-white bg-opacity-75 p-4 rounded ${
              isHovered1 ? 'hovered' : ''
            }`}
            onMouseEnter={() => setIsHovered1(true)}
            onMouseLeave={() => setIsHovered1(false)}>
            <h5 className="font">CID here:</h5>
            <input
              type="text"
              placeholder="Enter CID"
              className="text"
              value={userCID}
              onChange={(e) => setUserCID(e.target.value)}
              style={{ width: '500px' }}
            />
            <button className="button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>

        <div style={{ height: '0px' }}></div>

        {submitted && (
          <div className="scroll-container">
            <div className="card-row">
              {Array(totalMinted + 1)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="card-col">
                    <NFTImage
                      tokenId={i}
                      getCount={getCount}
                      userCID={userCID}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function NFTImage({ tokenId, getCount, userCID }) {
  // const contentId = 'Qme6Ckj2vQMw3TNhkiRoho9cyqADJfAXFRjrurUFVXkcWG'
  const contentId = 'QmdELJvw41fvuR4Gq9WLL5kD5eUrUz5xoi4kfMHfB1MA4T'
  const metadataURI = `${contentId}/${tokenId}.json`
  const imageURI = userCID
    ? `https://gateway.pinata.cloud/ipfs/${userCID}/${tokenId}.png`
    : placeholder

  const [isMinted, setIsMinted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const mintTimeoutRef = useRef(null)
  const [showModal, setShowModal] = useState(false)

  const openModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

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
      // await contract
      //   .payToMint(addr, metadataURI, {
      //     value: ethers.utils.parseEther('0.05'),
      //   })
      //   .then((tx) => {
      //     provider.waitForTransaction(tx.hash).then(() => {
      //       console.log('success mint!')
      //       console.log(tx.hash)
      //     })
      //   })
      //   .catch((error) => {
      //     alert('Cancelled by user!')
      //     console.log(error.message)
      //   })

      try {
        await contract
          .payToMint(addr, metadataURI, {
            value: ethers.utils.parseEther('0.05'),
          })
          .then((tx) => {
            return provider.waitForTransaction(tx.hash).then(() => {
              console.log('success mint!')
              console.log(tx.hash)
            })
          })
      } catch (error) {
        alert('Cancelled by user!')
        console.log(error.message)
      } finally {
        getMintedStatus()
        getCount()

        setIsLoading(false)
        setProgress(0)
      }
    }, 2000)
  }

  async function getURI() {
    const uri = await contract.tokenURI(tokenId)
    alert(uri)
  }

  return (
    <div className="card" style={{ width: '18rem', height: '420px' }}>
      <img
        src={isMinted ? imageURI : placeholder}
        className="card-img-top"
        alt={`NFT ${tokenId}`}
        style={{ objectFit: 'cover', height: '300px', cursor: 'pointer' }}
        onClick={openModal}
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
            <button className="button" disabled>
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

      {/* Bootstrap Modal */}
      {showModal && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{
            display: 'block',
          }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detailed Image</h5>
                <button
                  type="button"
                  className="button"
                  onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <img
                  src={isMinted ? imageURI : placeholder}
                  alt={`NFT ${tokenId}`}
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
