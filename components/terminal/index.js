import React from "react";
import Terminal from "terminal-in-react";
import { Box, useColorMode, useTheme } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
export default function Sidebar() {
  const theme = useTheme();
  const showMsg = () => "Hello World";
  const { colorMode } = useColorMode();
  const primary = colorMode === 'light' ? theme.colors.lightPrimary : theme.colors.primary

  const bgColor = colorMode === "light" ? "#ffffff" : "#17233A";
  const { t } = useTranslation("common");
  return (
    <Box w="100%" h="calc(100vh - 650px)">
      <Terminal
        id="terminal"
        color={primary}
        backgroundColor={bgColor}
        prompt={theme.colors.secondary}
        promptSymbol="➜ "
        allowTabs={false}
        hideTopBar={true}
        style={{
          width: "100%",
          padding: "0",
          margin: "-5px",
          fontWeight: "400",
          fontSize: "24px",
          opacity: "0.8",
          height: "calc(100vh - 750px)",
          overflow: "scroll",
          fontFamily: "Poppins",
        }}
        commandPassThrough={(cmd) => `➜ ${cmd}: ${t("cmd.not.found")}`}
        commands={{
          q: {
            method: (args, print, runCommand) => {
              console.log(args);
              const domain = args._[0];
              // print(`The color is ${args._[0] || args.color}`)
              runCommand("edit-line 123");
            },
            options: [
              {
                name: "q",
                description: "The color the output should be",
                defaultValue: "white",
              },
            ],
          },
          "type-text": (args, print, runCommand) => {
            const text = args.slice(1).join(" ");
            for (let i = 0; i < text.length; i += 1) {
              setTimeout(() => {
                runCommand(`edit-line ${text.slice(0, i + 1)}`);
              }, 100 * i);
            }
          },
        }}
        descriptions={{
          q: "query domain name status",
        }}
        msg={t("diman.search.tip")}
      />
    </Box>
  );
}
