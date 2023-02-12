import axios from 'axios'
import { cors } from 'utils/middleware'

const queryIpfs = async (req, res) => {
  await cors(req, res)

  try {
    const { cid, id } = req.query
    if (cid && id) {
      const url = `https://gateway.pinata.cloud/ipfs/${cid}/${id}`

      const { data } = await axios.get(url, {
        headers: {
          Accept: 'text/plain',
        },
      })
      console.log(data)
      res.status(200).json(data)
    } else {
      res.status(200).json({})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.toString(), msg: 'Error' })
  }
}

export default queryIpfs
