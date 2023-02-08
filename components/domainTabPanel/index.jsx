import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import {
  Box,
  Flex,
  Text,
  Tabs,
  TabList,
  Divider,
  Tab,
  TabPanels,
  TabPanel,
  IconButton,
  Tooltip,
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
// import ReactGA from 'react-ga'
import DomainInfoAddrs from '../domainInfoAddrs'
import DomainInfoAssets from '../domainInfoAssets'
import DomainInfoTexts from '../domainInfoTexts'
import Subdomains from '../subdomainsPanel'
import { setInfoModalStatus } from '../../stores/modal'

export default function Comp(props) {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)

  const { domain, isOwner } = props

  const keys = ['profile', 'address', 'assets', 'others', 'subdomain']

  return (
    <Box w="100%">
      <Tabs
        variant="unstyled"
        pos="relative"
        index={index}
        onChange={(idx) => {
          // ReactGA.event({
          //   category: `Change stats root tab`,
          //   action: `User change ${idx}`,
          // })
          setIndex(idx)
        }}
        defaultIndex={0}
      >
        <TabList>
          {keys.map((key, idx) => {
            const isSelected = idx === index
            return (
              <Flex key={idx}>
                <Tab
                  mx={-1.5}
                  color={isSelected ? 'secondary' : 'primary'}
                  textDecoration={isSelected ? 'underline' : ''}
                  fontSize="10px"
                  key={idx}
                  size="xs"
                >
                  <Box p={0}> {isSelected ? `<${t(key)}>` : `${t(key)}`}</Box>
                </Tab>
                {idx !== keys.length - 1 ? (
                  <Divider
                    mt={2.5}
                    h="18px"
                    w="1"
                    orientation="vertical"
                    opacity="1"
                  />
                ) : null}
              </Flex>
            )
          })}
        </TabList>
        {isOwner && (
          <Box pos="absolute" p={1} top={-1} right={0}>
            <Tooltip hasArrow label={t('set.records')}>
              <IconButton
                opacity="1"
                size="sm"
                variant="ghost"
                borderColor="primary"
                textColor="primary"
                icon={<EditIcon />}
                onClick={() => {
                  setInfoModalStatus(true)
                }}
              />
            </Tooltip>
          </Box>
        )}
        <TabPanels minH="100px">
          <TabPanel>
            <DomainInfoTexts
              isOwner={isOwner}
              domain={domain}
              field="profile"
            />
          </TabPanel>
          <TabPanel>
            <DomainInfoAddrs isOwner={isOwner} domain={domain} />
          </TabPanel>
          <TabPanel>
            <DomainInfoAssets isOwner={isOwner} domain={domain} />
          </TabPanel>
          <TabPanel>
            <DomainInfoTexts
              isOwner={isOwner}
              domain={domain}
              field="flowns_custom"
            />
          </TabPanel>
          <TabPanel>
            <Subdomains isOwner={isOwner} domain={domain} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
