import { validateAddress, fclinit } from 'utils'
import { getScriptByAddressAndName } from '../../../config/whitelist'

const scripts = async (req, res) => {
  try {
    fclinit()
    const { name, address } = req.query
    if (!validateAddress(0, address) || !name) {
      return res.status(500).json({ error: 'Invalid params' })
    }
    let script = getScriptByAddressAndName(address, name)

    return res.status(200).json({ script })
  } catch (error) {
    // res.status(200).json([])
    console.log(error)
    res.status(500).json({ error: error.toString(), msg: 'Get script failed' })
  }
}

export default scripts
