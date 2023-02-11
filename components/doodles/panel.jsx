import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Avatar,
  Image,
} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import doodleABI from '/api/doodles.json'

const EthNFTs = dynamic(() => import('components/nfts/eth'), {
  ssr: false,
})
const FlowNFTs = dynamic(() => import('components/nfts/flow'), {
  ssr: false,
})

export default function Comp(props) {
  const { domainInfo = {}, defaultDomain = '' } = props
  console.log(domainInfo)
  const { owner = '', addresses = {}, texts = {} } = domainInfo
  // const ethAddr = addresses[1]
  const ethAddr = '0x9854716BB75963c53c4f8cCA97B74B94Db848a71'
  const ethLogo = '/assets/eth.svg'
  const flowLogo = '/assets/flow.svg'

  const doodlesNFTs = [
    {
      label: 'Wearables',
      icon: 'https://res.cloudinary.com/hxn7xk7oa/image/upload/v1675040916/Doodles2_Wearables_Square_6380ca9885.jpg',
      content: () => {},
      content: () => <FlowNFTs addr={owner} path={'wearables'} />,
      chainId: 0,
      address: '0xe81193c424cfd3fb',
    },
    {
      label: 'Doodles',
      icon: 'https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?auto=format&w=256',
      content: () => (
        <EthNFTs
          nft={'0x8a90cab2b38dba80c64b7734e58ee1db38b8992e'}
          abi={doodleABI}
          addr={ethAddr}
        />
      ),
      chainId: 1,
      address: '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e',
    },
    {
      label: 'Dooplicator',
      icon: 'https://i.seadn.io/gae/RrCR2EKxJnu_JoadezfSwRBFeiYexn54OwWyAtGdCfZpfvwmjlxiqrajlOrIJ1ri9SRnc6P-UxW9_saOFwp69vUDcxxr_Wr2S_YXjqc?auto=format&w=256',
      content: () => {},
      chainId: 1,
      address: '0x466cfcd0525189b573e794f554b8a751279213ac',
    },
    {
      label: 'Genesis Box',
      icon: 'https://i.seadn.io/gcs/files/f4d45dbfa3027e116714b786da95c9bd.png?auto=format&w=256',
      content: () => {},
      chainId: 1,
      address: '0xb75f09b4340aeb85cd5f2dd87d31751edc11ed39',
    },
  ]

  const IconTab = ({ children, tabConfig }) => {
    const { icon, chainId } = tabConfig
    return (
      <Tab>
        <Avatar size="sm" name="Ethereum" mr={2} src={icon}>
          {/* <AvatarBadge
            boxSize="1.25em"
            // bg={chainId == 0 ? ethLogo.src : flowLogo.src}
            bg={chainId == 0 ? 'green' : flowLogo.src}
          /> */}
          <Image
            pos="absolute"
            top="22px"
            right="0px"
            borderRadius="full"
            border="1px solid white"
            bg="white"
            w="10px"
            h="10px"
            src={chainId == 1 ? ethLogo : flowLogo}
          />
        </Avatar>
        {children}
      </Tab>
    )
  }

  const NFTTab = ({ data }) => {
    return (
      <Tabs>
        <Flex w="100" justify={['space-between']}>
          <TabList>
            {data
              .filter((t) => t.chainId == 0)
              .map((tab, index) => (
                <IconTab key={index} tabConfig={tab}>
                  {tab.label}
                </IconTab>
              ))}
          </TabList>

          <TabList>
            {data
              .filter((t) => t.chainId == 1)
              .map((tab, index) => (
                <IconTab key={index} tabConfig={tab}>
                  {tab.label}
                </IconTab>
              ))}
          </TabList>
        </Flex>

        <TabPanels>
          {data.map((tab, index) => (
            <TabPanel p={4} key={index}>
              {tab.content()}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    )
  }
  return <NFTTab data={doodlesNFTs} />
}
