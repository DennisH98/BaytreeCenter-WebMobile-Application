import { Button, IconButton } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { As, useTheme } from "@chakra-ui/system";
import {
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/table";
import React from "react";
import { stringToBool } from "../../util/misc";
import { BsThreeDotsVertical } from "react-icons/bs";
import Icon from "@chakra-ui/icon";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/popover";
import { Heading, List, ListIcon, ListItem } from "@chakra-ui/react";

export interface DataRowAction {
  name: string;
  icon: As<any>;
  action: (dataRow) => void;
}

export interface DataGridColumn {
  header: string;
  dataField?: string;
  dataType?: "dateTime" | "currency" | "date";
  componentFunc?: (dataRow: any) => React.ReactElement;
}

export interface DataGridProps {
  data: Record<string, any>[];
  cols: DataGridColumn[];
  caption?: string;
  height?: string;
  dataRowActions?: DataRowAction[];
}

const DataGrid: React.FunctionComponent<DataGridProps> = (props) => {
  const theme = useTheme();

  const renderDateTimeValue = (dateTime: Date | string | null) => {
    if (!dateTime) {
      return "";
    }

    if (typeof dateTime === "string") {
      dateTime = new Date(dateTime);
    }

    return theme.formatters.dateTimeFormatter(dateTime);
  };

  const renderCurrencyValue = (currency: string | null) => {
    // TODO: Create baytree theme formatter for currency

    return theme.formatters.currencyFormatter(currency);
  };

  const renderDateValue = (date: Date | string | null) => {
    if (!date) {
      return "";
    }

    if (typeof date === "string") {
      date = new Date(date);
    }

    return theme.formatters.dateFormatter(date);
  };

  const renderBooleanValue = (bool: boolean | string | null) => {
    return (
      <Checkbox
        isReadOnly
        colorScheme="primary"
        borderColor="blackAlpha.500"
        defaultIsChecked={typeof bool === "string" ? stringToBool(bool) : bool}
      ></Checkbox>
    );
  };

  return (
    <Table variant="striped" colorScheme="gray" height={props.height ?? "auto"}>
      <TableCaption>{props.caption}</TableCaption>
      <Thead>
        <Tr>
          {props.cols.map((col, i) => (
            <Th key={`datagrid_headercell_${i}`}>{col.header}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {props.data.map((dataRow, i) => (
          <Tr height="fit-content" key={`datagrid_row_${i}`}>
            {props.cols.map((col, j) => (
              <Td height="fit-content" key={`datagrid_cell_${i}_${j}`}>
                {col.componentFunc
                  ? col.componentFunc(dataRow)
                  : col.dataType === "date"
                  ? renderDateValue(dataRow[col.dataField])
                  : col.dataType === "currency"
                  ? renderCurrencyValue(dataRow[col.dataField])
                  : col.dataType === "dateTime"
                  ? renderDateTimeValue(dataRow[col.dataField])
                  : typeof dataRow[col.dataField] === "boolean"
                  ? renderBooleanValue(dataRow[col.dataField])
                  : dataRow[col.dataField]}
              </Td>
            ))}
            {props.dataRowActions && (
              <Td
                height="fit-content"
                key={`datagrid_cell_more_options_row_${i}`}
              >
                <Popover>
                  <PopoverTrigger>
                    <IconButton
                      aria-label="More options"
                      icon={<Icon as={BsThreeDotsVertical} />}
                      background="none"
                    ></IconButton>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>
                      <List spacing={5}>
                        {props.dataRowActions.map((dataRowAction, i) => (
                          <ListItem
                            key={`ListItem_${i}`}
                            style={{ width: "100%" }}
                            boxSize="fit-content"
                            onClick={() => dataRowAction.action(dataRow)}
                            _hover={{ backgroundColor: "lightgray" }}
                          >
                            <ListIcon
                              width="28px"
                              height="28px"
                              as={dataRowAction.icon}
                            />
                            <span style={{ userSelect: "none" }}>
                              {dataRowAction.name}
                            </span>
                          </ListItem>
                        ))}
                      </List>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Td>
            )}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default DataGrid;
