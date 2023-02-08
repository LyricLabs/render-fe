import { useState, useEffect, useRef } from 'react'
import { Flex, Stack, Center, Box } from '@chakra-ui/react'
// import Avatar from 'boring-avatars'
import { useTranslation } from 'next-i18next'

import { toast } from '../../utils'

import { namehash } from '../../utils/hash'
import { createSubdomain, setSubdomainText } from '../../api'

import DashBtn from '../dashBtn'

export default function Comp(props) {
  const { t } = useTranslation()
  const ref = useRef()

  const [loading, setLoading] = useState(false)
  const [beamSvg, setBeamSvg] = useState(name)

  const { domain, styles, cb, isOwner } = props
  const { name, nameHash, subdomains, subdomainCount } = domain
  const beamName = 'beam-avatar'
  const subdomainName = `${beamName}.${name}`
  const subDomainHash = namehash(subdomainName)

  const beamDomain = subdomains[subDomainHash] || null

  // console.log(beamDomain, '===')

  const minted = beamDomain && beamDomain.texts && beamDomain.texts['beam-avatar']

  useEffect(() => {
    if (ref.current) {
      const svgNode = ref.current.innerHTML
      const svgStart = svgNode.indexOf('<svg')
      const svgEnd = svgNode.indexOf('</svg>') + 6
      const svgResult = svgNode.substring(svgStart, svgEnd).toString()

      setBeamSvg(svgResult)
    }
  }, [beamSvg, subDomainHash])

  const createBeamSubdomain = async () => {
    try {
      setLoading(true)
      const res = await createSubdomain(subdomainName)
      const { status = 0 } = res
      if (status === 4) {
        // ReactGA.event({
        //   category: `tranferModal`,
        //   action: `${from} transfer ${token} to ${to} success`,
        //   value: gaVaule,
        // })
        toast({
          title: t(`create.sub.success`, { name: subdomainName }),
          status: 'success',
        })
        setLoading(false)
        cb()
      }
    } catch (error) {
      toast({
        title: t(`create.sub.success`, { name: subdomainName }),
        status: 'error',
      })
      setLoading(false)
    }
  }

  const mintBeam = async (hash) => {
    try {
      setLoading(true)
      const res = await setSubdomainText(nameHash, hash, beamName, {
        name: beamName,
        img: beamSvg,
        type: 'svg',
        xmlns: 'http://www.w3.org/2000/svg',
      })
      const { status = 0 } = res
      if (status === 4) {
        toast({
          title: t(`mint.success`, { name: subdomainName }),
          status: 'success',
        })
        setLoading(false)
        cb()
      }
    } catch (error) {
      console.log(error)
      toast({
        title: t(`mint.success`, { name: subdomainName }),
        status: 'error',
      })
      setLoading(false)
    }
  }

  const downloadSvg = () => {
    var container = document.getElementById('container')
    var svgs = container.getElementsByTagName('svg')
    let data = new XMLSerializer().serializeToString(svgs[0])
    let svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
    let url = URL.createObjectURL(svgBlob)

    triggerDownload(url, 'beam.svg')
  }

  const downloadPng = () => {
    var canvas = document.getElementById('canvas')
    var ctx = canvas.getContext('2d')
    var container = document.getElementById('container')
    var svgs = container.getElementsByTagName('svg')
    var data = new XMLSerializer().serializeToString(svgs[0])
    var DOMURL = window.URL || window.webkitURL || window

    var img = new Image()
    var svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
    var url = DOMURL.createObjectURL(svgBlob)

    img.onload = function () {
      ctx.drawImage(img, 0, 0)
      DOMURL.revokeObjectURL(url)

      var imgURI = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')

      triggerDownload(imgURI, 'beam.png')
    }
    img.src = url
  }

  let triggerDownload = (imgURI, fileName) => {
    let a = document.createElement('a')

    a.setAttribute('download', fileName)
    a.setAttribute('href', imgURI)
    a.setAttribute('target', '_blank')

    a.click()
  }

  return (
    <>
      <Center h='400px' {...styles}>
        {beamDomain ? (
          <Stack>
            <Center w='100%' h='300px' ref={ref} id='container'>
              <Box border='4px solid' borderColor='color' borderRadius='full'>
                {/* <Avatar
                  size={200}
                  name={nameHash}
                  variant='beam'
                  // colors={['#234D20', '#36802D', '#77AB59', '#C9DF8A', '#F0F7DA']}
                  colors={['#00E075', '#17233A', '#FFFFFF', '#6E3CDA', '#21D27D']}
                /> */}
              </Box>
            </Center>
            {!minted ? (
              <DashBtn isLoading={loading} onClick={() => mintBeam(subDomainHash)}>
                {t('mint.beam')}
              </DashBtn>
            ) : (
              <>
                {isOwner && (
                  <Flex w='100%' justify='space-between'>
                    <DashBtn onClick={downloadSvg}>{t('download.avatar.svg')}</DashBtn>
                    <DashBtn ml={2} onClick={downloadPng}>
                      {t('download.avatar.png')}
                    </DashBtn>
                  </Flex>
                )}
              </>
            )}
            <canvas height={200} width={200} id='canvas' hidden='true'></canvas>
          </Stack>
        ) : (
          <DashBtn isLoading={loading} onClick={createBeamSubdomain}>
            {t('create.sub.beam')}
          </DashBtn>
        )}
      </Center>
    </>
  )
}
