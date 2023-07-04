import {
  Button,
  Flex,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import FetchHelper from "helpers/FetchHelper";
import { useCallback, useEffect, useState } from "react";
import { IoMdEye } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function UseDatatable({
  fetcher = null,
  url,
  order = "",
  handleError = () => {},
}) {
  // ** STATE ** //
  const [dataList, setDataList] = useState({
    data: [],
    meta: {},
  });
  const [filter, setFilter] = useState({ page: 1, take: 10, search: "" });
  const router = useHistory();
  const fetchHelper = FetchHelper(router);

  // ** FNC ** //
  const fetchData = useCallback(async () => {
    try {
      let filters = [];
      if (filter.page === "") {
        handleFilter("page", 1);
        return;
      }
      if (filter.take === "" || filter.take < 5) {
        handleFilter("take", 5);
        return;
      }

      for (let key in filter) {
        if (key !== undefined) {
          filters.push(`${key}=${filter[key]}`);
        }
      }

      if (order) {
        filters.push(order);
      }

      const urlPath = `${url}?${filters.join("&")}`;
      if (fetcher == null) {
        fetcher = fetchHelper.get;
      }
      let response = await fetcher(urlPath);
      console.log(response);
      delete response.statusCode;
      setDataList(() => response);
    } catch (error) {
      handleError(error);
    }
  }, [fetchHelper, filter, handleError, url]);

  // ** ACTION ** //
  const handleFilter = async (name, val) => {
    setFilter((prev) => ({ ...prev, [name]: val }));
  };

  // ** EFFECT ** //
  useEffect(() => fetchData(), []);

  useEffect(() => {
    const timeOutId = setTimeout(async () => await fetchData(), 1000);
    return () => clearTimeout(timeOutId);
  }, [filter]);

  // ** RETURN DATA ** //
  return {
    fetchData,
    dataList,
    handleFilter,
    filter,
  };
}

// ** WIDGET ** //
export const DatatableComponent = ({
  header = [],
  datatable = null,
  filter = true,
  title = "Data Table",
  content = () => {},
  action = () => {},
}) => {
  return (
    <>
      <Flex px="25px" justify="space-between" mb="20px" align="center">
        <Flex>
          <div style={{ marginRight: 8 }}>
            <Text marginBottom={2}>Page</Text>
            <NumberInput
              size="sm"
              maxW={20}
              defaultValue={1}
              min={1}
              max={
                datatable !== null
                  ? datatable?.dataList?.meta?.pageCount ?? 1
                  : 1
              }
              onChange={(val) =>
                datatable !== null
                  ? datatable?.handleFilter("page", val) ?? {}
                  : {}
              }
              name="page"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </div>

          <div style={{ marginRight: 8 }}>
            <Text marginBottom={2}>Take</Text>
            <NumberInput
              size="sm"
              maxW={20}
              defaultValue={10}
              max={100}
              min={5}
              onChange={(val) =>
                datatable !== null
                  ? datatable?.handleFilter("take", val) ?? {}
                  : {}
              }
              name="take"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </div>
        </Flex>
        {filter && (
          <div style={{ marginRight: 8 }}>
            <Text marginBottom={2}>Search</Text>
            <Input
              name="search"
              onChange={(e) =>
                datatable !== null
                  ? datatable?.handleFilter("search", e.target.value)
                  : {}
              }
            />
          </div>
        )}
      </Flex>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>{title}</TableCaption>
          <Thead>
            <Tr>
              {header?.map((item, index) => (
                <Th key={index}>{item}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {datatable?.dataList?.data?.map((item, index) => (
              <Tr key={index}>
                <Td>
                  {datatable !== null
                    ? index +
                      1 +
                      (datatable?.filter?.take * datatable?.filter?.page -
                        datatable?.filter?.take)
                    : 0}
                </Td>
                {content({ item })}
                <Td>{action({ item })}</Td>
              </Tr>
            ))}
            {datatable?.dataList?.data?.length === 0 && (
              <Tr>
                <Td colSpan={header.length} style={{ textAlign: "center" }}>
                  Data Kosong
                </Td>
              </Tr>
            )}
          </Tbody>

          <Tfoot>
            <Tr>
              {header?.map((item, index) => (
                <Th key={index}>{item}</Th>
              ))}
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  );
};
