/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import { AUTH_URL } from "constants/Url";
import FetchHelper from "helpers/FetchHelper";
import React, { useEffect, useState } from "react";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdCalendarMonth,
  MdFileCopy,
  MdMap,
  MdNewspaper,
} from "react-icons/md";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function UserReports() {
  // Chakra Color Mode
  const router = useHistory();
  const [data, setData] = useState({});
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  useEffect(() => {
    const init = async () => {
      try {
        // http://192.168.1.12:13371/auth/statistik
        const response = await FetchHelper(router).get(
          `${AUTH_URL}/auth/statistik`
        );
        setData(() => response.data);
      } catch (error) {
        console.log("ERROR FECTH DATA");
      }
    };

    init();
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon
                  w="32px"
                  h="32px"
                  as={MdCalendarMonth}
                  color={brandColor}
                />
              }
            />
          }
          name="Jumlah Agenda"
          value={data.agenda ?? 0}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdNewspaper} color={brandColor} />
              }
            />
          }
          name="Jumlah Berita"
          value={data.berita ?? 0}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdMap} color={brandColor} />}
            />
          }
          name="Peta Data"
          value={data.petadata ?? 0}
        />
      </SimpleGrid>
    </Box>
  );
}
